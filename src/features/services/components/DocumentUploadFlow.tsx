'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { PdfScanner } from './PdfScanner';
import { PrintConfig } from '@/features/manuals/types';
import { PrintOptions } from '@/features/manuals/components/PrintOptions';
import { useCart } from '@/features/cart/providers/CartProvider';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';
import { workerClient } from '@/lib/api/workerClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFileUploadStore } from '@/features/services/store/useFileUploadStore';
import { PriceBreakdown } from '@/features/cart/components/PriceBreakdown';
import { useSupport } from '@/hooks/useSupport';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';
import { openWhatsAppChat } from '@/utils/whatsapp';

interface DocumentUploadFlowProps {
  title: string;
  subtitle: string;
  serviceType: 'hall_ticket' | 'custom';
  allowedBindings?: PrintConfig['bindingType'][];
  basePrice: number;
}

export const DocumentUploadFlow = ({ title, subtitle, serviceType, allowedBindings, basePrice }: DocumentUploadFlowProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<'configure' | 'send_whatsapp' | 'confirm_whatsapp'>('configure');
  const [hasOpenedDocWhatsApp, setHasOpenedDocWhatsApp] = useState(false);
  const { supportWhatsapp } = useSupport();
  const setPendingFile = useFileUploadStore((state) => state.setPendingFile);
  const setConfirmedDocument = useFileUploadStore((state) => state.setConfirmedDocument);
  
  const [config, setConfig] = useState<PrintConfig>({
    copies: 1,
    singleSided: true,
    color: false,
    bindingType: allowedBindings && allowedBindings.length > 0 ? allowedBindings[0] : 'none',
    paperSize: 'a4'
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setFinalFile(null);
      setIsScanning(true);
      setPageCount(null);
      setDocumentId(null);
    }
  };

  const handleScanComplete = (pages: number, serverDocumentId: string, uploadedFile: File) => {
    setPageCount(pages);
    setDocumentId(serverDocumentId);
    setFinalFile(uploadedFile);
    setIsScanning(false);
  };

  const handleScanFailed = (error?: string) => {
    setFiles([]);
    setFinalFile(null);
    setIsScanning(false);
    setPageCount(null);
    setDocumentId(null);
  };
  
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: pricingResponse, isFetching: isPricingFetching } = useQuery({
    queryKey: ['pricing', documentId, pageCount, config, appliedOffer],
    queryFn: () => workerClient.calculatePricing({
      items: [{
        id: 'preview',
        serviceType: serviceType,
        documentId: documentId,
        pages: pageCount,
        printOptions: config
      }],
      deliveryMethod: 'delivery',
      offerCode: appliedOffer || undefined
    }),
    enabled: !!documentId && !!pageCount,
    staleTime: 1000 * 60, // 1 minute
  });

  const breakdown = pricingResponse?.items?.[0] || {
    subtotal: undefined,
    printingCost: 0,
    bindingCost: 0,
    colorCost: 0
  };
  
  const handleAddToCart = () => {
    if (!finalFile || !pageCount || !documentId) return;
    
    setIsAdding(true);
    
    // Save to global state so it can be uploaded post-payment
    setPendingFile(documentId, {
      documentId,
      serviceType,
      pages: pageCount.toString(),
      file: finalFile,
    });
    
    addItem({
      id: `ci_${Date.now()}`,
      referenceId: documentId,
      serviceType: serviceType,
      title: finalFile.name,
      subtitle: `${pageCount} Pages • ${config.copies} Copies`,
      quantity: 1,
      printOptions: { ...config, pages: pageCount } as any,
      priceBreakdown: {
        base: breakdown.subtotal,
        printing: breakdown.printingCost,
        binding: breakdown.bindingCost,
        color: breakdown.colorCost,
        total: breakdown.subtotal
      },
      status: 'in_cart',
      editable: true,
      removable: true
    });
    
    router.push(APP_ROUTES.CART);
  };

  const handleRemoveFile = async () => {
    if (documentId) {
      try {
        await workerClient.deleteDocument(documentId);
      } catch (e) {
        console.error('Failed to delete document from server', e);
      }
    }
    
    setFiles([]);
    setFinalFile(null);
    setIsScanning(false);
    setPageCount(null);
    setDocumentId(null);
    setConfig({
      copies: 1,
      singleSided: true,
      color: false,
      bindingType: allowedBindings && allowedBindings.length > 0 ? allowedBindings[0] : 'none',
      paperSize: 'a4'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReplaceFile = () => {
    handleRemoveFile();
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);
  };

  return (
    <div className="flex flex-col flex-1 relative h-full">
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".zip,.pdf,application/pdf,application/zip,application/x-zip-compressed"
            multiple
            className="hidden" 
            onChange={handleFileSelect}
          />

          {files.length === 0 && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <UploadCloud className="w-12 h-12 text-primary mb-4" />
              <p className="font-bold text-foreground">Upload PDF</p>
              <p className="text-xs text-muted-foreground mt-1">Tap to browse files</p>
            </div>
          )}

          {files.length > 0 && isScanning && (
            <PdfScanner 
              files={files} 
              serviceType={serviceType}
              onScanComplete={handleScanComplete} 
              onScanFailed={handleScanFailed} 
            />
          )}

          {files.length > 0 && !isScanning && pageCount && finalFile && (
            <>
              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 mb-3 shadow-sm">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-foreground opacity-50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{finalFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pageCount} Pages • {finalFile.name.endsWith('.zip') ? 'ZIP Archive' : 'PDF'} • {serviceType === 'hall_ticket' ? 'Ready to print' : 'Ready to print'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={handleReplaceFile}
                  className="flex-1 py-2.5 text-sm font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                >
                  Replace File
                </button>
                <button 
                  onClick={handleRemoveFile}
                  className="flex-1 py-2.5 text-sm font-bold text-destructive bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors"
                >
                  Remove
                </button>
              </div>
              
              <PrintOptions 
                config={config} 
                onChange={setConfig} 
                allowedBindings={allowedBindings}
                pageCount={pageCount}
              />
              
              <div className="mt-8">
                <div className="mb-6">
                  <PriceBreakdown 
                    summary={{
                      subtotal: breakdown.subtotal || 0,
                      originalSubtotal: breakdown.originalSubtotal || breakdown.subtotal || 0,
                      printingCost: breakdown.printingCost || 0,
                      originalPrintingCost: breakdown.originalPrintingCost || breakdown.printingCost || 0,
                      bindingCost: breakdown.bindingCost || 0,
                      originalBindingCost: breakdown.originalBindingCost || breakdown.bindingCost || 0,
                      discount: pricingResponse?.summary?.discount || 0,
                      offerDiscount: pricingResponse?.summary?.offerDiscount || 0,
                      deliveryFee: pricingResponse?.summary?.deliveryFee || 0,
                      platformFee: pricingResponse?.summary?.platformFee || 0,
                      isLaunchActive: pricingResponse?.summary?.isLaunchActive ?? true,
                      appliedOffer: appliedOffer || pricingResponse?.summary?.appliedOffer || null,
                      total: pricingResponse?.summary?.grandTotal || breakdown.subtotal || 0
                    }}
                    onApplyOffer={async (code) => {
                      setAppliedOffer(code);
                      await queryClient.invalidateQueries({ queryKey: ['pricing', documentId] });
                      return { success: true };
                    }}
                    isApplyingOffer={isPricingFetching}
                  />
                </div>
                
                <div className="bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center border border-secondary/30 mb-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Delivery</span>
                  <span className="text-sm font-bold text-foreground">{pricingResponse?.estimatedDelivery || 'Tomorrow, 9:15 AM'}</span>
                </div>

                {/* STEP 2 & STEP 3: Directly open WhatsApp on clicking Send Document on WhatsApp */}
                {flowStep === 'configure' && (
                  <button
                    onClick={() => {
                      const waNumber = supportWhatsapp || process.env.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER || '919652929243';
                      const refCode = documentId ? documentId.slice(0, 8).toUpperCase() : 'UPLOAD';
                      const msg = `Hi BLINTZY 👋\n\nI am sending my document for printing.\n\nUpload Ref: ${refCode}\nDocument: ${finalFile.name}\nPages: ${pageCount}\nCopies: ${config.copies}\nOptions: ${config.color ? 'Colour' : 'B&W'} • ${config.singleSided ? 'Single Sided' : 'Double Sided'} • ${config.bindingType || 'None'}\nEstimated Amount: ₹${pricingResponse?.summary?.grandTotal || breakdown.subtotal || 0}\n\n📎 Please upload your documents here on WhatsApp.\nI am attaching my original PDF file here.`;
                      
                      setHasOpenedDocWhatsApp(true);
                      openWhatsAppChat(waNumber, msg);
                      setFlowStep('confirm_whatsapp');
                    }}
                    disabled={isAdding || breakdown.subtotal === undefined}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-5 text-base rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {breakdown.subtotal === undefined ? 'Calculating Price...' : 'Send Document on WhatsApp →'}
                  </button>
                )}

                {flowStep === 'confirm_whatsapp' && (
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-foreground">
                        Have You Sent Your Document?
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Return to BLINTZY after attaching and sending your original document on WhatsApp.
                      </p>
                    </div>

                    <div className="bg-muted/40 rounded-xl p-3 text-xs space-y-1.5 border border-border/60">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Document:</span>
                        <span className="font-semibold text-foreground truncate max-w-[200px]">{finalFile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages:</span>
                        <span className="font-semibold text-foreground">{pageCount} pages ({config.copies} {config.copies > 1 ? 'copies' : 'copy'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upload Reference:</span>
                        <span className="font-mono text-primary font-bold">{documentId ? documentId.slice(0, 8).toUpperCase() : 'UPLOAD'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Amount:</span>
                        <span className="font-bold text-foreground">₹{pricingResponse?.summary?.grandTotal || breakdown.subtotal || 0}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => {
                          if (documentId) {
                            setConfirmedDocument(documentId, true);
                          }
                          handleAddToCart();
                        }}
                        disabled={isAdding}
                        className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-70"
                      >
                        <Check className="w-5 h-5 stroke-[3]" /> I've Sent the Document ✓
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const waNumber = supportWhatsapp || process.env.NEXT_PUBLIC_BLINTZY_WHATSAPP_NUMBER || '919652929243';
                          const refCode = documentId ? documentId.slice(0, 8).toUpperCase() : 'UPLOAD';
                          const msg = `Hi BLINTZY 👋\n\nI am sending my document for printing.\n\nUpload Ref: ${refCode}\nDocument: ${finalFile.name}\nPages: ${pageCount}\nCopies: ${config.copies}\nOptions: ${config.color ? 'Colour' : 'B&W'} • ${config.singleSided ? 'Single Sided' : 'Double Sided'} • ${config.bindingType || 'None'}\nEstimated Amount: ₹${pricingResponse?.summary?.grandTotal || breakdown.subtotal || 0}\n\n📎 Please upload your documents here on WhatsApp.\nI am attaching my original PDF file here.`;
                          openWhatsAppChat(waNumber, msg);
                        }}
                        className="w-full text-xs text-primary hover:underline font-semibold py-2 text-center"
                      >
                        Didn't send yet? Reopen WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={() => setFlowStep('configure')}
                        className="w-full text-xs text-muted-foreground hover:text-foreground py-1 text-center"
                      >
                        ← Edit document configuration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


