"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, Eye } from 'lucide-react';
import { PrintOptions } from '@/features/manuals/components/PrintOptions';
import { PrintConfig } from '@/features/manuals/types';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { APP_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';
import { mapManual } from '@/features/manuals/mappers';

function OptionsSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') || '';
  const yearId = searchParams.get('yearId') || '';
  const semesterId = searchParams.get('semesterId') || '';
  const subjectId = searchParams.get('subjectId') || '';
  const manualId = searchParams.get('manualId') || '';

  const [config, setConfig] = useState<PrintConfig>({
    copies: 1,
    singleSided: false,
    color: false,
    bindingType: 'spiral',
    paperSize: 'a4'
  });

  // Preview State
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { data: manualResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['manual', manualId],
    queryFn: () => workerClient.getManual(manualId),
    enabled: !!manualId
  });

  const manualDTO = manualResponse?.manual;
  const manual = manualDTO ? mapManual({
    ...manualDTO,
    name: manualDTO.title,
    updated_at: new Date().toISOString(), // Fallback if missing
    language: 'English',
    uploaded_by: 'Admin'
  }) : null;
  
  const { data: pricingResponse, isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing', manualId, config],
    queryFn: () => workerClient.calculatePricing({
      items: [{
        serviceType: 'manual',
        manualId,
        printOptions: {
          color: config.color,
          singleSided: config.singleSided,
          bindingType: config.bindingType,
          copies: config.copies
        }
      }],
      deliveryMethod: 'delivery'
    }),
    enabled: !!manualId
  });

  const priceBreakdown = pricingResponse?.items?.[0] || null;
  const orderSummary = pricingResponse?.summary || null;

  const handleContinue = () => {
    const configParams = new URLSearchParams({
      branchId,
      yearId,
      semesterId,
      subjectId,
      manualId,
      copies: config.copies.toString(),
      singleSided: config.singleSided.toString(),
      color: config.color.toString(),
      bindingType: config.bindingType,
      paperSize: config.paperSize
    });
    router.push(`${APP_ROUTES.MANUALS_WORKFLOW.REVIEW}?${configParams.toString()}`);
  };

  const handleOpenPreview = async () => {
    setShowPreview(true);
    if (previewUrl) return; // already loaded
    
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const blob = await workerClient.getManualFileBlob(manualId);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (e: any) {
      if (e.message?.includes('401')) {
        setPreviewError('Please sign in again.');
      } else if (e.message?.includes('403')) {
        setPreviewError("You don't have permission to view this preview.");
      } else if (e.message?.includes('404')) {
        setPreviewError('File unavailable for this manual.');
      } else {
        setPreviewError('Unable to load file. Please try again.');
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  if (!manual) return <div className="p-8 text-center">Manual not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-safe">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground">Print Options</h1>
        </div>

        {(isLoading || pricingLoading) ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00] mb-4"></div>
            <p className="text-gray-500 text-sm">Loading options...</p>
          </div>
        ) : isError || !manual || !priceBreakdown ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 mt-20 text-center">
            <p className="text-red-500 font-medium mb-4">Unable to load print options or pricing</p>
            <button onClick={() => refetch()} className="bg-[#FF6B00] text-white px-6 py-2 rounded-xl">Try again</button>
          </div>
        ) : (
        <>
        {/* Manual Information Card */}
        <div className="px-4 mb-4">
          {manualDTO.stock > 0 && manualDTO.stock <= 5 && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-xl text-sm font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Only {manualDTO.stock} {manualDTO.stock === 1 ? 'copy' : 'copies'} left in stock!
            </div>
          )}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">Manual</span>
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-xl font-bold text-foreground leading-tight">{manual.name}</h2>
                <p className="text-sm font-semibold text-foreground mt-1">{subjectId.toUpperCase()}</p>
              </div>
              {manual.hasPreview && (
                <button 
                  onClick={handleOpenPreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20 rounded-full text-sm font-bold transition-colors shrink-0"
                  aria-label="View Full Manual"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Manual</span>
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {branchId.toUpperCase()} • Year {yearId} • Semester {semesterId}
            </p>
          </div>
        </div>

        <PrintOptions config={config} onChange={setConfig} maxCopies={manualDTO.stock || 100} />

        {/* Price Breakdown */}
        <div className="px-4 mt-2 mb-6">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Printing</span>
              <span className="font-medium">₹{priceBreakdown.printingCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Binding</span>
              <span className="font-medium">₹{priceBreakdown.bindingCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-bold text-green-600">{orderSummary?.deliveryFee === 0 ? 'FREE' : `₹${orderSummary?.deliveryFee || 0}`}</span>
            </div>
            <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-1">
              <span className="font-semibold text-foreground">Total (1 item)</span>
              <div className="text-right">
                <span className="text-xl font-bold text-[#FF6B00]">₹{orderSummary?.grandTotal || priceBreakdown.subtotal}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center border border-secondary/30">
            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Delivery</span>
            <span className="text-sm font-bold text-foreground">{pricingResponse?.estimatedDelivery || 'Tomorrow, 9:15 AM'}</span>
            <span className="text-xs text-muted-foreground mt-2 text-center">Need it urgently? Visit the print shop with your Order ID for assistance.</span>
          </div>
        </div>
        </>
        )}
      </div>
      <div className="p-4 bg-background border-t border-border sticky bottom-0 z-10">
        <Button onClick={handleContinue} className="w-full bg-primary text-primary-foreground h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
          Continue to Review →
        </Button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[430px] z-[100] bg-background flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleClosePreview}
                className="p-2 -ml-2 rounded-full hover:bg-secondary/50 transition-colors"
                aria-label="Close manual"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground line-clamp-1">{manual.name}</span>
                <span className="text-xs text-muted-foreground uppercase">FULL MANUAL</span>
              </div>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 relative bg-secondary/10 flex items-center justify-center">
            {previewLoading && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading manual...</p>
              </div>
            )}

            {previewError && !previewLoading && (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Load Failed</p>
                  <p className="text-sm text-muted-foreground">{previewError}</p>
                </div>
                <button 
                  onClick={() => {
                    setPreviewUrl(null);
                    handleOpenPreview();
                  }}
                  className="px-6 py-2 bg-secondary text-foreground rounded-full text-sm font-bold hover:bg-secondary/80 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {previewUrl && !previewLoading && (
              <iframe 
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title={`${manual.name} File`}
              />
            )}
          </div>

          {/* Footer Back CTA */}
          <div className="p-4 border-t border-border bg-card shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
            <button
              onClick={handleClosePreview}
              className="w-full bg-primary text-primary-foreground font-bold py-4 text-lg rounded-xl shadow-md hover:scale-[1.02] transition-transform"
            >
              Continue to Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OptionsSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OptionsSelectionContent />
    </Suspense>
  );
}
