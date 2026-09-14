'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileArchive, FileText, CheckCircle, AlertTriangle, Loader2, Info, ChevronRight, Calculator, File as FileIcon } from 'lucide-react';
import JSZip from 'jszip';
import { useCart } from '@/features/cart/providers/CartProvider';
import { PrintOptions } from '@/features/manuals/components/PrintOptions';
import { useRouter } from 'next/navigation';
import { workerClient } from '@/lib/api/workerClient';
import { APP_ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';
import { getPdfPageCount, getPdfPageCountFromBuffer } from '../utils/pdfParser';

type FlowState = 'idle' | 'analyzing' | 'analysis_completed' | 'selecting_options' | 'calculating_price' | 'ready_for_cart' | 'uploading' | 'completed' | 'failed' | 'oversized';

export const CodeTantraUploadFlow = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [uploadState, setUploadState] = useState<FlowState>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [finalFileName, setFinalFileName] = useState('');
  
  // Analysis state
  const [totalPages, setTotalPages] = useState(0);
  const [pdfCount, setPdfCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [zipFileCount, setZipFileCount] = useState(0);
  const [pdfDetails, setPdfDetails] = useState<{name: string, pages: number}[]>([]);
  const [otherFiles, setOtherFiles] = useState<string[]>([]);
  
  // File to ultimately upload
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Printing Options
  const [printConfig, setPrintConfig] = useState<any>({
    copies: 1,
    color: false,
    singleSided: true,
    bindingType: 'none',
    paperSize: 'a4'
  });
  
  // Price Breakdown
  const [priceData, setPriceData] = useState<any>(null);

  // Settings state
  const [settings, setSettings] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    workerClient.getCodeTantraSettings()
      .then(res => setSettings(res.settings))
      .catch(err => console.error('Failed to load settings', err));
  }, []);

  // Fetch live price whenever options change (if we are past analysis)
  useEffect(() => {
    if (uploadState === 'selecting_options' || uploadState === 'ready_for_cart' || uploadState === 'calculating_price') {
      fetchPrice();
    }
  }, [printConfig]);

  const fetchPrice = async () => {
    try {
      setUploadState('calculating_price');
      setError(null);
      
      const payload = {
        items: [
          {
            serviceType: 'code_tantra_files',
            pages: totalPages,
            printOptions: {
              color: printConfig.color,
              singleSided: printConfig.singleSided,
              bindingType: printConfig.bindingType,
              copies: printConfig.copies
            }
          }
        ],
        deliveryMethod: 'pickup'
      };
      
      const res = await workerClient.calculatePricing(payload);
      if (res.items && res.items.length > 0) {
        setPriceData(res.items[0]);
        setUploadState('ready_for_cart');
      } else {
        throw new Error('No items returned');
      }
    } catch (err: any) {
      console.error(err);
      setError('Pricing error: ' + (err.message || 'Could not reach server'));
      setPriceData(null);
      setUploadState('selecting_options');
    }
  };

  const countPdfPages = async (file: File): Promise<number> => {
    try {
      return await getPdfPageCount(file);
    } catch (err) {
      console.error('Failed to parse PDF', err);
      return 0; // Fallback or throw? We'll return 0 so it doesn't hard crash the whole loop
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    
    // Validation rules
    if (selected.length === 0) return;
    
    let hasZip = false;
    let hasPdf = false;
    let unsupported = false;
    let size = 0;
    
    selected.forEach(f => {
      size += f.size;
      if (f.name.endsWith('.zip') || f.type === 'application/zip') hasZip = true;
      else if (f.name.endsWith('.pdf') || f.type === 'application/pdf') hasPdf = true;
      else unsupported = true;
    });
    
    if (unsupported) {
      setError('Only ZIP or PDF files are allowed.');
      return;
    }
    
    if (hasZip && hasPdf) {
      setError('You cannot mix ZIP and PDF files in the same submission.');
      return;
    }
    
    if (hasZip && selected.length > 1) {
      setError('You can only upload ONE ZIP file per submission.');
      return;
    }
    
    if (settings?.hardMaximum && size > settings.hardMaximum) {
      setError(`Total file size exceeds the maximum hard limit of ${(settings.hardMaximum / 1024 / 1024).toFixed(0)}MB.`);
      return;
    }
    
    setError(null);
    setFiles(selected);
    setTotalSize(size);
    setUploadState('idle');
    setProgress(0);
    setPdfDetails([]);
    setOtherFiles([]);
  };

  const handleStartAnalysis = async () => {
    if (files.length === 0) return;
    
    setUploadState('analyzing');
    setError(null);
    
    try {
      let fUpload: File;
      let pages = 0;
      let pCount = 0;
      let zCount = 0;
      let pDetails: {name: string, pages: number}[] = [];
      let oFiles: string[] = [];
      
      if (files.length === 1 && (files[0].name.endsWith('.zip') || files[0].type === 'application/zip')) {
        fUpload = files[0];
        // Analyze ZIP for PDFs
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(fUpload);
        zCount = Object.keys(loadedZip.files).length;
        
        const pdfFiles = Object.keys(loadedZip.files).filter(k => k.toLowerCase().endsWith('.pdf') && !loadedZip.files[k].dir);
        pCount = pdfFiles.length;
        
        oFiles = Object.keys(loadedZip.files).filter(k => !k.toLowerCase().endsWith('.pdf') && !loadedZip.files[k].dir);
        
        for (const pdfName of pdfFiles) {
          const pdfData = await loadedZip.files[pdfName].async('arraybuffer');
          try {
            const count = await getPdfPageCountFromBuffer(pdfData);
            pages += count;
            pDetails.push({ name: pdfName.split('/').pop() || pdfName, pages: count });
          } catch (e) {
            console.error(`Failed to parse ${pdfName} in ZIP`);
          }
        }
      } else if (files.length === 1 && (files[0].name.endsWith('.pdf') || files[0].type === 'application/pdf')) {
        fUpload = files[0];
        pages = await countPdfPages(fUpload);
        pCount = 1;
        pDetails.push({ name: fUpload.name, pages });
      } else if (files.length > 1) {
        // Multiple PDFs -> ZIP
        const zip = new JSZip();
        for (const file of files) {
          zip.file(file.name, file);
          const count = await countPdfPages(file);
          pages += count;
          pDetails.push({ name: file.name, pages: count });
        }
        pCount = files.length;
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        fUpload = new File([zipBlob], 'code-tantra-files.zip', { type: 'application/zip' });
      } else {
        throw new Error('Invalid file configuration');
      }

      setTotalPages(pages);
      setPdfCount(pCount);
      setZipFileCount(zCount);
      setPdfDetails(pDetails);
      setOtherFiles(oFiles);
      setFinalFileName(fUpload.name);
      setFileToUpload(fUpload);

      if (pCount === 0) {
        throw new Error('No PDF files were detected inside this submission. Please verify the files before continuing.');
      }

      // Check Oversized Policy after analysis
      if (settings?.enableOversizedReview && fUpload.size > (settings.reviewThreshold || 104857600)) {
        setUploadState('oversized');
        return;
      }
      
      setUploadState('analysis_completed');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
      setUploadState('failed');
    }
  };

  const proceedToOptions = () => {
    setUploadState('selecting_options');
    fetchPrice();
  };

  const handleAddToCartAndUpload = async () => {
    if (!fileToUpload || !priceData) return;
    
    setUploadState('uploading');
    setError(null);
    setProgress(0);
    
    try {
      // 1. Upload file to R2 temporarily
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const uploadRes = await workerClient.request('/api/custom-files/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(100);
      setUploadedFileId(uploadRes.fileId);
      
      // 2. Add to Cart
      addItem({
        id: `ct_${Date.now()}`,
        referenceId: uploadRes.fileId,
        serviceType: 'code_tantra_files',
        title: 'Code Tantra Files',
        subtitle: finalFileName,
        quantity: 1,
        printOptions: { 
          copies: printConfig.copies, 
          color: printConfig.color, 
          singleSided: printConfig.singleSided, 
          bindingType: printConfig.bindingType, 
          paperSize: 'a4',
          totalPages,
          pdfCount,
          isCodeTantra: true
        },
        priceBreakdown: {
          base: priceData.unitPrice,
          printing: priceData.printingCost,
          binding: priceData.bindingCost,
          color: 0,
          total: priceData.subtotal
        },
        status: 'in_cart',
        editable: false,
        removable: true
      });
      
      setUploadState('completed');
      
      // Delay navigation slightly for UX
      setTimeout(() => {
        router.push(APP_ROUTES.CART);
      }, 1000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload.');
      setUploadState('ready_for_cart');
    }
  };

  const handleRequestReview = async () => {
    try {
      setUploadState('uploading');
      await workerClient.createOversizedRequest({
        fileName: finalFileName,
        fileSize: totalSize,
        pdfCount,
        totalPages,
        printingOptions: JSON.stringify({ 
          copies: printConfig.copies, 
          color: printConfig.color, 
          singleSided: printConfig.singleSided, 
          bindingType: printConfig.bindingType, 
          paperSize: 'A4' 
        })
      });
      
      toast.success('Review request submitted!');
      handleReset();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review request');
      setUploadState('oversized');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadState('idle');
    setUploadedFileId(null);
    setProgress(0);
    setError(null);
    setFileToUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const goBackToAnalysis = () => {
    setUploadState('analysis_completed');
  };

  return (
    <div className="flex flex-col flex-1 relative h-full">
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4">
          
          {/* Header instructions only on idle state */}
          {uploadState === 'idle' && (
            <div className="text-sm text-muted-foreground mb-6 bg-secondary/20 p-4 rounded-xl border border-secondary/30">
              <p>Upload your project files as a ZIP file, or upload one or more PDF files. We will analyze your files locally before uploading.</p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li>Accepted formats: <strong>ZIP</strong> and <strong>PDF</strong></li>
                <li>Multiple PDFs are automatically combined into one ZIP</li>
                {settings?.reviewThreshold && (
                  <li>Files over {(settings.reviewThreshold / 1024 / 1024).toFixed(0)}MB require admin review</li>
                )}
              </ul>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".zip,.pdf,application/zip,application/pdf" 
            multiple
            className="hidden" 
            onChange={handleFileSelect}
          />

          {uploadState === 'idle' && files.length === 0 && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#FF6B00]/30 rounded-2xl p-8 flex flex-col items-center justify-center bg-[#FF6B00]/5 cursor-pointer hover:bg-[#FF6B00]/10 transition-colors"
            >
              <UploadCloud className="w-12 h-12 text-[#FF6B00] mb-4" />
              <p className="font-bold text-foreground">Select ZIP or PDFs</p>
              <p className="text-xs text-muted-foreground mt-1">Tap to browse files</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm border border-red-100">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {files.length > 0 && uploadState === 'idle' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
                <p className="font-bold text-sm">Selected Files ({files.length})</p>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {f.name.endsWith('.zip') ? <FileArchive className="w-5 h-5 text-orange-500" /> : <FileText className="w-5 h-5 text-red-500" />}
                    <span className="truncate flex-1 font-medium">{f.name}</span>
                    <span className="text-muted-foreground text-xs">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
                <div className="pt-2 border-t flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Total Size:</span>
                  <span>{(totalSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-2.5 text-sm font-bold text-destructive bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={handleStartAnalysis}
                  className="flex-1 py-2.5 text-sm font-bold bg-[#FF6B00] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                >
                  Analyze Files
                </button>
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {uploadState === 'analyzing' && (
            <div className="mt-6 p-6 bg-card border border-border rounded-xl text-center space-y-4">
              <div className="flex justify-center mb-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
              </div>
              <p className="font-bold text-lg">Inspecting Contents & Reading PDF Metadata...</p>
              <p className="text-xs text-muted-foreground">This happens locally in your browser.</p>
            </div>
          )}

          {/* Analysis Completed State */}
          {uploadState === 'analysis_completed' && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">File Analysis Result</h3>
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-red-500">Remove Files</button>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5 text-blue-500" />
                    <span className="font-bold">{finalFileName}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{(fileToUpload?.size || totalSize) / 1024 / 1024 < 1 ? '< 1' : ((fileToUpload?.size || totalSize) / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                    <p className="text-2xl font-bold text-[#FF6B00]">{pdfCount}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">PDF Files</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                    <p className="text-2xl font-bold text-[#FF6B00]">{totalPages}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Pages</p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground">PDF Details:</p>
                  <ul className="text-sm space-y-1.5 max-h-32 overflow-y-auto pr-2">
                    {pdfDetails.map((pdf, idx) => (
                      <li key={idx} className="flex justify-between border-b border-border/50 pb-1 last:border-0">
                        <span className="truncate pr-4">• {pdf.name}</span>
                        <span className="text-muted-foreground shrink-0">{pdf.pages} pgs</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {otherFiles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Other files detected:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto">
                      {otherFiles.slice(0, 5).map((f, idx) => (
                        <li key={idx}>• {f}</li>
                      ))}
                      {otherFiles.length > 5 && <li>• ...and {otherFiles.length - 5} more</li>}
                    </ul>
                    <p className="text-[10px] text-orange-500 mt-1">* Non-PDF files will not be printed.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={proceedToOptions}
                className="w-full py-4 text-lg font-bold bg-[#FF6B00] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
              >
                Configure Printing Options
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Printing Options & Price */}
          {(uploadState === 'selecting_options' || uploadState === 'calculating_price' || uploadState === 'ready_for_cart') && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={goBackToAnalysis}>
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Analysis
              </div>
              
              <div>
                <h3 className="font-bold mb-4 pb-2 text-xl">Print Options</h3>
                
                <PrintOptions 
                  config={printConfig} 
                  onChange={setPrintConfig} 
                  allowedBindings={['none', 'spiral']}
                  maxCopies={100}
                  pageCount={totalPages}
                />
              </div>

              {/* Price Breakdown */}
              {uploadState === 'calculating_price' ? (
                <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3 justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Calculating price...</p>
                </div>
              ) : error || !priceData ? (
                <div className="bg-card rounded-2xl border border-red-200 p-5 shadow-sm flex flex-col gap-3 justify-center items-center py-6">
                  <p className="text-sm text-red-500 font-medium">Failed to load pricing: {error || 'Unknown error'}</p>
                  <button onClick={fetchPrice} className="text-xs text-[#FF6B00] hover:underline mt-2">Try Again</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Printing</span>
                      <span className="font-medium text-foreground">₹{priceData.printingCost?.toFixed(0)}</span>
                    </div>
                    {priceData.bindingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Binding</span>
                        <span className="font-medium text-foreground">₹{priceData.bindingCost?.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between items-center mt-1">
                      <span className="font-bold text-foreground">Total ({printConfig.copies} item{printConfig.copies > 1 ? 's' : ''})</span>
                      <span className="text-2xl font-black text-[#FF6B00]">₹{priceData.subtotal?.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="bg-secondary/20 rounded-xl p-4 flex flex-col items-center justify-center border border-secondary/30">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1 font-medium">Estimated Delivery</span>
                    <span className="text-sm font-bold text-foreground mb-1">Tomorrow, 9:15 AM</span>
                    <span className="text-[10px] text-muted-foreground text-center">Need it urgently? Visit the print shop with your Order ID for assistance.</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAddToCartAndUpload}
                className="w-full py-4 text-lg font-bold bg-[#FF6B00] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
              >
                Add to Cart & Proceed
              </button>
            </div>
          )}

          {/* Uploading State (Adding to Cart) */}
          {uploadState === 'uploading' && (
            <div className="mt-6 p-6 bg-card border border-border rounded-xl text-center space-y-4">
              <div className="flex justify-center mb-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" />
              </div>
              <p className="font-bold text-lg">Uploading securely...</p>
              <p className="text-sm text-muted-foreground truncate px-4">{finalFileName}</p>
              
              <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-[#FF6B00] h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs font-mono">{progress}% uploaded</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-4">* Uploading temporarily to secure cart</p>
              <p className="text-[10px] text-muted-foreground">Please do not close this page.</p>
            </div>
          )}

          {/* Oversized Warning */}
          {uploadState === 'oversized' && (
            <div className="mt-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <Info className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
                <h3 className="font-bold text-lg text-center text-yellow-800">Admin Review Required</h3>
                <p className="text-sm mt-2 text-yellow-700 text-center">
                  {settings?.oversizedMessage || 'This file is above the current standard upload review threshold. Please contact the BLINTZY Admin for approval before continuing.'}
                </p>
                <div className="mt-4 bg-white/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between py-1 border-b border-yellow-100"><span className="text-yellow-600">Total Size:</span> <span className="font-medium">{(totalSize / 1024 / 1024).toFixed(2)} MB</span></div>
                  <div className="flex justify-between py-1 border-b border-yellow-100"><span className="text-yellow-600">Total PDFs:</span> <span className="font-medium">{pdfCount}</span></div>
                  <div className="flex justify-between py-1"><span className="text-yellow-600">Total Pages:</span> <span className="font-medium">{totalPages}</span></div>
                </div>
              </div>

              <div className="flex gap-3 flex-col">
                <a 
                  href={`https://wa.me/91${settings?.whatsappNumber || '9581353999'}?text=${encodeURIComponent(
                    settings?.whatsappMessageTemplate
                      ?.replace('{fileName}', finalFileName)
                      ?.replace('{fileSize}', (totalSize / 1024 / 1024).toFixed(2) + ' MB')
                      ?.replace('{pdfCount}', pdfCount.toString())
                      ?.replace('{totalPages}', totalPages.toString()) || 'Hello Admin, I have an oversized Code Tantra file for review.'
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 text-sm font-bold bg-[#25D366] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
                >
                  Contact Admin on WhatsApp
                </a>
                <button 
                  onClick={handleRequestReview}
                  className="w-full py-3 text-sm font-bold bg-[#FF6B00] text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                >
                  Submit Review Request
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Choose Another File
                </button>
              </div>
            </div>
          )}
          
          {uploadState === 'completed' && (
            <div className="mt-6 text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-700">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <h3 className="font-bold text-lg">Added to Cart!</h3>
                <p className="text-sm">Redirecting to checkout...</p>
              </div>
            </div>
          )}
          
          {uploadState === 'failed' && (
            <div className="mt-6">
               <button 
                  onClick={() => setUploadState('idle')}
                  className="w-full py-3 text-sm font-bold bg-secondary text-secondary-foreground rounded-xl"
                >
                  Try Again
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
