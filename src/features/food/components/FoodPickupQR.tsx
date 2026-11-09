'use client';

import React, { useMemo } from 'react';
import { ShieldCheck, QrCode } from 'lucide-react';

interface FoodPickupQRProps {
  tokenNumber: string;
  pickupOtp: string;
  pickupQrSecret: string;
  orderNumber?: string;
  size?: number;
}

export const FoodPickupQR: React.FC<FoodPickupQRProps> = ({
  tokenNumber,
  pickupOtp,
  pickupQrSecret,
  orderNumber,
  size = 180,
}) => {
  // Deterministic 15x15 pseudo-random grid seeded by pickupQrSecret + orderNumber
  const matrix = useMemo(() => {
    const seedStr = `${pickupQrSecret}_${tokenNumber}_${pickupOtp}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 17;
    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false)
    );

    // Standard QR Position Detection Patterns (Corners)
    const setCornerMarker = (startR: number, startC: number) => {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
          const isCenter = r === 2 && c === 2;
          grid[startR + r][startC + c] = isBorder || isCenter;
        }
      }
    };

    setCornerMarker(0, 0); // Top-Left
    setCornerMarker(0, gridSize - 5); // Top-Right
    setCornerMarker(gridSize - 5, 0); // Bottom-Left

    // Fill data area pseudo-randomly based on hash
    let currHash = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner finder zones
        if (
          (r < 5 && c < 5) ||
          (r < 5 && c >= gridSize - 5) ||
          (r >= gridSize - 5 && c < 5)
        ) {
          continue;
        }
        currHash = (currHash * 1103515245 + 12345) & 0x7fffffff;
        grid[r][c] = currHash % 3 !== 0;
      }
    }

    return grid;
  }, [pickupQrSecret, tokenNumber, pickupOtp]);

  const gridSize = matrix.length;
  const cellSize = size / gridSize;

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 shadow-sm select-none">
      {/* 1. Header with Token Number */}
      <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-gray-150 text-xs">
        <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
          Counter Verification
        </span>
        <span className="font-black text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/80 text-[11px]">
          Token {tokenNumber}
        </span>
      </div>

      {/* 2. QR Matrix SVG */}
      <div 
        className="relative p-2.5 bg-white rounded-xl shadow-xs border border-gray-150 flex items-center justify-center"
        style={{ width: size + 20, height: size + 20 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rounded"
          aria-label={`Pickup QR code for token ${tokenNumber}`}
        >
          <rect width={size} height={size} fill="#ffffff" />
          {matrix.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize * 0.94}
                  height={cellSize * 0.94}
                  rx={cellSize * 0.15}
                  fill="#151515"
                />
              ) : null
            )
          )}
        </svg>

        {/* Center Logo Shield */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center shadow-md border-2 border-white">
            <QrCode className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 3. 4-Digit Pickup OTP Badge */}
      <div className="mt-3 flex flex-col items-center gap-1 w-full">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Pickup Verification Code
        </span>
        <div className="flex items-center gap-2">
          {pickupOtp.split('').map((digit, idx) => (
            <span
              key={idx}
              className="w-8 h-9 rounded-lg bg-[#151515] text-[#FF6B00] font-black text-base flex items-center justify-center shadow-xs border border-zinc-700 tracking-wider font-mono"
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Verification Explanation */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-gray-500 font-medium text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Scan QR or share 4-digit code at pickup counter</span>
      </div>
    </div>
  );
};

