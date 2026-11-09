'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface LandmarkInfo {
  id: string;
  name: string;
  category: string;
  status: 'AVAILABLE' | 'COMING SOON' | 'ECOSYSTEM';
  tagline: string;
  description: string;
  note?: string;
  actionText?: string;
  actionUrl?: string;
  screenPos: { x: number; y: number };
}

interface Campus3DHeroCanvasProps {
  onHoverLandmark?: (landmark: LandmarkInfo | null) => void;
  scrollProgress?: number; // 0 to 1
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

export function Campus3DHeroCanvas({
  onHoverLandmark,
  scrollProgress = 0,
}: Campus3DHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse & camera state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });
  const hoveredLandmarkIdRef = useRef<string | null>(null);
  const [activeHUD, setActiveHUD] = useState<LandmarkInfo | null>(null);

  // Check reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Mouse handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
    mouseRef.current.isHovering = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseRef.current.isHovering = false;
    hoveredLandmarkIdRef.current = null;
    setActiveHUD(null);
    if (onHoverLandmark) onHoverLandmark(null);
  }, [onHoverLandmark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let packetT = 0;

    // IntersectionObserver to pause loop when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // High-DPI Canvas Resizing
    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Landmark metadata definitions
    const landmarksMeta: Record<string, Omit<LandmarkInfo, 'screenPos'>> = {
      printHub: {
        id: 'printHub',
        name: 'BLINTZY Print Hub',
        category: 'Campus Printing',
        status: 'AVAILABLE',
        tagline: 'Academic documents delivered to your classroom desk.',
        description: 'Upload PDFs from your phone or laptop. Configure duplex, color, and spiral binding with transparent upfront pricing.',
        actionText: 'Start Printing',
        actionUrl: '/app/login',
      },
      foodCourt: {
        id: 'foodCourt',
        name: 'Campus Food Court',
        category: 'Dining Services',
        status: 'COMING SOON',
        tagline: 'Planned campus canteen meal ordering.',
        description: 'Pre-order canteen meals between lectures to avoid waiting in long counter lines.',
        note: 'Planned campus service • Non-operational preview',
      },
      busTerminal: {
        id: 'busTerminal',
        name: 'College Bus Terminal',
        category: 'Campus Transit',
        status: 'COMING SOON',
        tagline: 'Planned college shuttle route information.',
        description: 'Transit schedule directory and arrival information for daily college commuters.',
        note: 'Planned campus service • Non-operational preview',
      },
      academicHall: {
        id: 'academicHall',
        name: 'Academic Complex',
        category: 'Lecture Blocks',
        status: 'ECOSYSTEM',
        tagline: 'Classrooms, labs, and lecture halls.',
        description: 'Orders placed on BLINTZY are routed directly to your department and classroom room number.',
        note: 'Destination for student classroom desk delivery',
      },
    };

    // Main 3D Render Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = containerRef.current?.clientWidth || 800;
      const height = containerRef.current?.clientHeight || 600;

      // LERP Mouse Smoothing
      const ease = 0.05;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * ease;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * ease;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Camera Perspective Calculations
      const mx = prefersReducedMotion ? 0 : mouseRef.current.x;
      const my = prefersReducedMotion ? 0 : mouseRef.current.y;
      const sp = Math.min(Math.max(scrollProgress, 0), 1);

      // Base isometric angles
      const rotY = Math.PI / 4 + mx * 0.12 - sp * 0.08; // Horizontal yaw rotation
      const rotX = Math.PI / 6.2 - my * 0.08 + sp * 0.06; // Elevation pitch angle

      // Camera center: desktop shifts right to make room for hero typography
      const isMobile = width < 768;
      const centerX = isMobile ? width * 0.5 : width * 0.58 + mx * 20;
      const centerY = height * 0.52 + my * 15 - sp * 35;
      const zoom = (Math.min(width, height) / 850) * (1 - sp * 0.1);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 3D to 2D projection formula
      const project = (p: Point3D): Point2D => {
        // Rotate around Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Apply scale & screen translation
        return {
          x: centerX + x1 * zoom,
          y: centerY - y2 * zoom,
        };
      };

      // Helper to draw 3D extruded prism (cube/building)
      const drawPrism = (
        x: number,
        z: number,
        w: number,
        d: number,
        h: number,
        topColor: string,
        leftColor: string,
        rightColor: string,
        baseY = 0,
        options: { isHovered?: boolean; strokeColor?: string } = {}
      ) => {
        const p0 = project({ x: x - w / 2, y: baseY, z: z - d / 2 });
        const p1 = project({ x: x + w / 2, y: baseY, z: z - d / 2 });
        const p2 = project({ x: x + w / 2, y: baseY, z: z + d / 2 });
        const p3 = project({ x: x - w / 2, y: baseY, z: z + d / 2 });

        const t0 = project({ x: x - w / 2, y: baseY + h, z: z - d / 2 });
        const t1 = project({ x: x + w / 2, y: baseY + h, z: z - d / 2 });
        const t2 = project({ x: x + w / 2, y: baseY + h, z: z + d / 2 });
        const t3 = project({ x: x - w / 2, y: baseY + h, z: z + d / 2 });

        // Left Face
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p0.x, p0.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();
        ctx.fillStyle = leftColor;
        ctx.fill();
        if (options.strokeColor) {
          ctx.strokeStyle = options.strokeColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Right Face
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t0.x, t0.y);
        ctx.closePath();
        ctx.fillStyle = rightColor;
        ctx.fill();
        if (options.strokeColor) {
          ctx.strokeStyle = options.strokeColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Top Face
        ctx.beginPath();
        ctx.moveTo(t0.x, t0.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t3.x, t3.y);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();

        if (options.isHovered) {
          ctx.strokeStyle = '#FF6B00';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (options.strokeColor) {
          ctx.strokeStyle = options.strokeColor;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      };

      // Helper to draw geometric 3D trees
      const drawTree = (tx: number, tz: number, heightScale = 1) => {
        // Trunk
        drawPrism(tx, tz, 6, 6, 14 * heightScale, '#8C7A6B', '#7A685A', '#6D5C4E', 0);
        // Foliage lower tier
        drawPrism(
          tx,
          tz,
          26 * heightScale,
          26 * heightScale,
          18 * heightScale,
          '#A3C2A0',
          '#8BAA88',
          '#7D9C7A',
          14 * heightScale
        );
        // Foliage upper tier
        drawPrism(
          tx,
          tz,
          18 * heightScale,
          18 * heightScale,
          14 * heightScale,
          '#B4D3B1',
          '#9CBFA9',
          '#8CAE89',
          30 * heightScale
        );
      };

      // 1. Draw Base Campus Plinth (Limestone foundation)
      drawPrism(0, 0, 680, 680, 16, '#F8F9F7', '#E4E5E2', '#D7D8D5', -16);

      // 2. Draw Campus Lawns & Plazas (Top surfaces)
      // Main central quadrangle lawn
      const quad0 = project({ x: -280, y: 0, z: -280 });
      const quad1 = project({ x: 280, y: 0, z: -280 });
      const quad2 = project({ x: 280, y: 0, z: 280 });
      const quad3 = project({ x: -280, y: 0, z: 280 });

      ctx.beginPath();
      ctx.moveTo(quad0.x, quad0.y);
      ctx.lineTo(quad1.x, quad1.y);
      ctx.lineTo(quad2.x, quad2.y);
      ctx.lineTo(quad3.x, quad3.y);
      ctx.closePath();
      ctx.fillStyle = '#EBF2EA'; // Soft spring campus grass
      ctx.fill();
      ctx.strokeStyle = '#D7E3D5';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Campus Perimeter Ring Road
      const drawRoad = (x: number, z: number, w: number, d: number) => {
        drawPrism(x, z, w, d, 1.5, '#E2E4E8', '#CFD2D8', '#C3C7CE', 0);
      };

      // Ring road sections
      drawRoad(0, 260, 560, 40);
      drawRoad(0, -260, 560, 40);
      drawRoad(260, 0, 40, 560);
      drawRoad(-260, 0, 40, 560);

      // Central Plaza Paving (Pedestrian hub)
      drawPrism(0, 0, 180, 180, 2, '#F4F4F1', '#E2E2DE', '#D5D5D1', 0);

      // Connecting brick pathways
      drawPrism(0, 160, 36, 160, 2, '#F0ECE6', '#DDD8D1', '#D0CBC4', 0);
      drawPrism(0, -160, 36, 160, 2, '#F0ECE6', '#DDD8D1', '#D0CBC4', 0);
      drawPrism(160, 0, 160, 36, 2, '#F0ECE6', '#DDD8D1', '#D0CBC4', 0);
      drawPrism(-160, 0, 160, 36, 2, '#F0ECE6', '#DDD8D1', '#D0CBC4', 0);

      // 4. Central Campus Fountain / Water Feature
      const fCenter = project({ x: 0, y: 2, z: 0 });
      ctx.beginPath();
      ctx.arc(fCenter.x, fCenter.y, 16 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#C8E4E8'; // Water blue
      ctx.fill();
      ctx.strokeStyle = '#A8CBD1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 5. LANDMARK 1: The BLINTZY Print Hub (East Sector: x=140, z=50)
      const isPrintHubHovered = hoveredLandmarkIdRef.current === 'printHub';
      // Base floor
      drawPrism(
        140,
        50,
        90,
        90,
        35,
        isPrintHubHovered ? '#FFFFFF' : '#FAFAFA',
        '#E5E5E5',
        '#D4D4D4',
        0,
        { isHovered: isPrintHubHovered, strokeColor: '#D1D5DB' }
      );
      // Cantilever second floor
      drawPrism(
        145,
        55,
        80,
        80,
        30,
        isPrintHubHovered ? '#FFF7ED' : '#FFFFFF',
        '#EFEFEF',
        '#E0E0E0',
        35,
        { isHovered: isPrintHubHovered }
      );
      // Architectural orange roof slab (BLINTZY Identity)
      drawPrism(145, 55, 86, 86, 6, '#FF6B00', '#EA580C', '#C2410C', 65);

      // Print Hub Rooftop Beacon & Pulse
      const printBeaconPos = project({ x: 145, y: 71, z: 55 });
      const pulseRadius = (12 + (Date.now() % 1600) / 100) * zoom;
      ctx.beginPath();
      ctx.arc(printBeaconPos.x, printBeaconPos.y, Math.max(pulseRadius, 4), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 107, 0, ${Math.max(0, 1 - (Date.now() % 1600) / 1600)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Active operational beacon light
      ctx.beginPath();
      ctx.arc(printBeaconPos.x, printBeaconPos.y, 4.5 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981'; // Operational green
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 6. LANDMARK 2: Campus Food Court (West Sector: x=-140, z=-40)
      const isFoodCourtHovered = hoveredLandmarkIdRef.current === 'foodCourt';
      drawPrism(
        -140,
        -40,
        100,
        80,
        28,
        isFoodCourtHovered ? '#FFFBEB' : '#FAFAFA',
        '#EAEAEA',
        '#DADADA',
        0,
        { isHovered: isFoodCourtHovered, strokeColor: '#D1D5DB' }
      );
      // Food court terrace pergolas / dining pavilion
      drawPrism(-140, -40, 90, 70, 8, '#F59E0B', '#D97706', '#B45309', 28);
      // Terrace umbrella pods
      drawPrism(-165, -60, 18, 18, 14, '#FFFFFF', '#EAEAEA', '#DADADA', 0);
      drawPrism(-165, -20, 18, 18, 14, '#FFFFFF', '#EAEAEA', '#DADADA', 0);

      // Food Court Beacon (Amber Coming Soon)
      const foodBeaconPos = project({ x: -140, y: 36, z: -40 });
      ctx.beginPath();
      ctx.arc(foodBeaconPos.x, foodBeaconPos.y, 4 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 7. LANDMARK 3: College Bus Terminal (North-East: x=120, z=-150)
      const isBusHovered = hoveredLandmarkIdRef.current === 'busTerminal';
      // Transit terminal platform
      drawPrism(
        120,
        -150,
        120,
        50,
        18,
        isBusHovered ? '#F0F9FF' : '#F1F3F5',
        '#E2E5E9',
        '#D5D9DF',
        0,
        { isHovered: isBusHovered }
      );
      // Canopy roof
      drawPrism(120, -150, 110, 42, 6, '#0284C7', '#0369A1', '#075985', 18);

      // Modeled miniature campus shuttle parked at bay
      drawPrism(145, -150, 42, 20, 14, '#FFFFFF', '#E5E7EB', '#D1D5DB', 0);
      drawPrism(145, -150, 40, 18, 3, '#10B981', '#059669', '#047857', 14); // Green shuttle stripe

      // Bus Terminal Beacon (Sky-Blue Coming Soon)
      const busBeaconPos = project({ x: 120, y: 24, z: -150 });
      ctx.beginPath();
      ctx.arc(busBeaconPos.x, busBeaconPos.y, 4 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#0284C7';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 8. LANDMARK 4: Central Academic Complex (North: x=-60, z=140)
      const isAcademicHovered = hoveredLandmarkIdRef.current === 'academicHall';
      // Block A
      drawPrism(
        -80,
        140,
        70,
        60,
        65,
        isAcademicHovered ? '#F8FAFC' : '#F1F5F9',
        '#E2E8F0',
        '#CBD5E1',
        0,
        { isHovered: isAcademicHovered, strokeColor: '#94A3B8' }
      );
      // Block B
      drawPrism(
        -20,
        155,
        60,
        50,
        50,
        isAcademicHovered ? '#F8FAFC' : '#F1F5F9',
        '#E2E8F0',
        '#CBD5E1',
        0,
        { isHovered: isAcademicHovered, strokeColor: '#94A3B8' }
      );
      // Connecting aerial glass skywalk
      drawPrism(-50, 145, 24, 16, 12, '#BAE6FD', '#7DD3FC', '#38BDF8', 35);

      // 9. Landscaped 3D Trees (Arranged organically along roads and quads)
      const treeCoords = [
        [-200, 200],
        [-170, 220],
        [-220, 160],
        [-80, 240],
        [-40, 240],
        [200, 200],
        [220, 160],
        [180, 220],
        [-220, -180],
        [-180, -220],
        [-220, -120],
        [220, -80],
        [200, -40],
        [-50, -120],
        [-80, -140],
        [50, -80],
        [70, -100],
        [-100, 40],
        [-60, 40],
      ];

      treeCoords.forEach(([tx, tz], i) => {
        drawTree(tx, tz, 0.85 + (i % 3) * 0.15);
      });

      // 10. Animated Courier Packets along delivery paths
      packetT = (packetT + 0.006) % 1;
      // Path: from Print Hub (140, 50) -> Central Plaza (0, 0) -> Academic Block (-80, 140)
      let packetPos3D: Point3D;
      if (packetT < 0.5) {
        const segT = packetT / 0.5;
        packetPos3D = {
          x: 140 + (0 - 140) * segT,
          y: 4,
          z: 50 + (0 - 50) * segT,
        };
      } else {
        const segT = (packetT - 0.5) / 0.5;
        packetPos3D = {
          x: 0 + (-80 - 0) * segT,
          y: 4,
          z: 0 + (140 - 0) * segT,
        };
      }

      const packetScreen = project(packetPos3D);
      ctx.beginPath();
      ctx.arc(packetScreen.x, packetScreen.y, 4 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B00';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 11. Screen-space Hit Detection for Landmarks
      const landmarksScreenPoints = [
        { id: 'printHub', pos: project({ x: 145, y: 35, z: 55 }), radius: 60 * zoom },
        { id: 'foodCourt', pos: project({ x: -140, y: 25, z: -40 }), radius: 55 * zoom },
        { id: 'busTerminal', pos: project({ x: 120, y: 15, z: -150 }), radius: 50 * zoom },
        { id: 'academicHall', pos: project({ x: -60, y: 40, z: 140 }), radius: 65 * zoom },
      ];

      // Screen mouse coordinate
      if (mouseRef.current.isHovering) {
        const smx = ((mouseRef.current.targetX + 1) / 2) * width;
        const smy = ((mouseRef.current.targetY + 1) / 2) * height;

        let detectedId: string | null = null;
        let detectedPos = { x: 0, y: 0 };

        for (const lm of landmarksScreenPoints) {
          const dx = smx - lm.pos.x;
          const dy = smy - lm.pos.y;
          if (dx * dx + dy * dy < lm.radius * lm.radius) {
            detectedId = lm.id;
            detectedPos = lm.pos;
            break;
          }
        }

        if (detectedId !== hoveredLandmarkIdRef.current) {
          hoveredLandmarkIdRef.current = detectedId;
          if (detectedId && landmarksMeta[detectedId]) {
            const info: LandmarkInfo = {
              ...landmarksMeta[detectedId],
              screenPos: detectedPos,
            };
            setActiveHUD(info);
            if (onHoverLandmark) onHoverLandmark(info);
          } else {
            setActiveHUD(null);
            if (onHoverLandmark) onHoverLandmark(null);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [scrollProgress, prefersReducedMotion, onHoverLandmark]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[550px] md:min-h-[700px] overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

      {/* Interactive Landmark Floating HUD Card */}
      {activeHUD && (
        <div
          className="absolute z-30 pointer-events-auto transition-all duration-200"
          style={{
            left: `${Math.max(20, Math.min(activeHUD.screenPos.x - 140, (containerRef.current?.clientWidth || 800) - 300))}px`,
            top: `${Math.max(20, activeHUD.screenPos.y - 140)}px`,
          }}
        >
          <div className="w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-[#EAEAEA]">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  activeHUD.status === 'AVAILABLE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : activeHUD.status === 'COMING SOON'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                ● {activeHUD.status}
              </span>
              <span className="text-[10px] font-semibold text-[#737373]">
                {activeHUD.category}
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#171717] mb-1">{activeHUD.name}</h4>
            <p className="text-xs text-[#737373] leading-relaxed mb-3">
              {activeHUD.tagline}
            </p>

            {activeHUD.actionText && activeHUD.actionUrl && (
              <a
                href={activeHUD.actionUrl}
                className="inline-flex w-full items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>{activeHUD.actionText}</span>
                <span>&rarr;</span>
              </a>
            )}

            {activeHUD.note && (
              <p className="text-[10px] font-medium text-[#737373] bg-[#F7F7F5] rounded-lg p-2 border border-[#EAEAEA]">
                {activeHUD.note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
