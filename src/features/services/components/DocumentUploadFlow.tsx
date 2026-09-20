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
import { useQuery } from '@tanstack/react-query';
import { useFileUploadStore } from '@/features/services/store/useFileUploadStore';

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
  const setPendingFile = useFileUploadStore((state) => state.setPendingFile);
  
  const [config, setConfig] = useState<PrintConfig>({
    copies: 1,
    singleSided: false,
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
  
  const { data: pricingResponse } = useQuery({
    queryKey: ['pricing', documentId, pageCount, config],
    queryFn: () => workerClient.calculatePricing({
      items: [{
        id: 'preview',
        serviceType: serviceType,
        documentId: documentId,
        pages: pageCount,
        printOptions: config
      }],
      deliveryMethod: 'delivery'
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
      singleSided: false,
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
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Printing</span>
                    <span className="font-medium">₹{breakdown.printingCost !== undefined ? breakdown.printingCost : '...'}</span>
                  </div>
                  {config.bindingType !== 'none' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Binding</span>
                      <span className="font-medium">₹{breakdown.bindingCost !== undefined ? breakdown.bindingCost : '...'}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-1">
                    <span className="font-bold text-foreground">Total Price</span>
                    <span className="text-2xl font-black text-primary">₹{breakdown.subtotal !== undefined ? breakdown.subtotal : '...'}</span>
                  </div>
                </div>
                
                <div className="bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center border border-secondary/30 mb-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Delivery</span>
                  <span className="text-sm font-bold text-foreground">{pricingResponse?.estimatedDelivery || 'Tomorrow, 9:15 AM'}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || breakdown.subtotal === undefined}
                  className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isAdding ? 'Adding to Cart...' : breakdown.subtotal === undefined ? 'Calculating Price...' : 'Add to Cart'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


