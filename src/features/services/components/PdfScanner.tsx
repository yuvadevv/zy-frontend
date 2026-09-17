'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ScanLine, FileCheck, AlertTriangle } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';
import JSZip from 'jszip';
import { getPdfPageCount, getPdfPageCountFromBuffer } from '../utils/pdfParser';

interface PdfScannerProps {
  files: File[];
  serviceType: 'hall_ticket' | 'custom';
  onScanComplete: (pages: number, documentId: string, finalFile: File) => void;
  onScanFailed: (error?: string) => void;
}

export const PdfScanner = ({ files, serviceType, onScanComplete, onScanFailed }: PdfScannerProps) => {
  const [status, setStatus] = useState<'scanning' | 'reading' | 'success' | 'error'>('scanning');
  const [pages, setPages] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const scanFile = async () => {
      try {
        if (!files || files.length === 0) throw new Error('No files provided');

        let fUpload: File;
        let totalPages = 0;
        
        const isSingleZip = files.length === 1 && (files[0].name.toLowerCase().endsWith('.zip') || files[0].type === 'application/zip' || files[0].type === 'application/x-zip-compressed');
        const isSinglePdf = files.length === 1 && (files[0].name.toLowerCase().endsWith('.pdf') || files[0].type === 'application/pdf');

        if (isSingleZip) {
          fUpload = files[0];
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(fUpload);
          const pdfFiles = Object.keys(loadedZip.files).filter(k => k.toLowerCase().endsWith('.pdf') && !loadedZip.files[k].dir);
          
          for (const pdfName of pdfFiles) {
            const pdfData = await loadedZip.files[pdfName].async('arraybuffer');
            try {
              const count = await getPdfPageCountFromBuffer(pdfData);
              totalPages += count;
            } catch (e) {
              console.error(`Failed to parse ${pdfName} in ZIP`);
            }
          }
        } else if (isSinglePdf) {
          fUpload = files[0];
          totalPages = await getPdfPageCount(fUpload);
        } else if (files.length > 1) {
          // Multiple files -> ZIP
          const zip = new JSZip();
          for (const file of files) {
            if (file.name.toLowerCase().endsWith('.zip')) {
              throw new Error('You cannot upload a ZIP file alongside other files.');
            }
            if (!file.name.toLowerCase().endsWith('.pdf')) {
              throw new Error('Only PDF files can be combined.');
            }
            zip.file(file.name, file);
            const count = await getPdfPageCount(file);
            totalPages += count;
          }
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          fUpload = new File([zipBlob], 'custom-print-files.zip', { type: 'application/zip' });
        } else {
          throw new Error('Unsupported file configuration');
        }

        if (totalPages === 0) {
          throw new Error('No valid PDF pages found in the upload.');
        }

        if (!mounted) return;
        setStatus('reading');
        
        // Step 2: Generate local document ID and return immediately
        // The actual upload will happen in the background handled by the parent
        const documentId = crypto.randomUUID();
        
        setStatus('success');
        setPages(totalPages);
        
        // Brief pause before reporting back to parent
        setTimeout(() => {
          if (mounted) onScanComplete(totalPages, documentId, fUpload);
        }, 600);
        
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setStatus('error');
        setErrorMessage(err.message || 'Error parsing files');
      }
    };
    
    scanFile();
    
    return () => { mounted = false; };
  }, [files, serviceType, onScanComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-border shadow-sm">
      <div className="relative w-20 h-24 mb-6">
        <FileText className={`w-full h-full ${status === 'error' ? 'text-destructive opacity-30' : 'text-primary opacity-30'}`} strokeWidth={1} />
        
        {(status === 'scanning' || status === 'reading') && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_8px_rgba(255,107,0,0.8)] z-10"
          />
        )}
        
        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1"
          >
            <FileCheck className="w-6 h-6 text-white" />
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -bottom-2 -right-2 bg-destructive rounded-full p-1"
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-foreground mb-2">
        {status === 'scanning' && 'Scanning your documents...'}
        {status === 'reading' && 'Reading pages...'}
        {status === 'success' && 'Preparing print options...'}
        {status === 'error' && (errorMessage || "Couldn't read page count")}
      </h3>
      
      {status === 'error' && (
        <button 
          onClick={() => onScanFailed()}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

