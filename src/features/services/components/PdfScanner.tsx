'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ScanLine, FileCheck, AlertTriangle } from 'lucide-react';
import { workerClient } from '@/lib/api/workerClient';

interface PdfScannerProps {
  file: File;
  serviceType: 'hall_ticket' | 'custom';
  onScanComplete: (pages: number, documentId: string) => void;
  onScanFailed: () => void;
}
import { PDFDocument } from 'pdf-lib';

export const PdfScanner = ({ file, serviceType, onScanComplete, onScanFailed }: PdfScannerProps) => {
  const [status, setStatus] = useState<'scanning' | 'reading' | 'success' | 'error'>('scanning');
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const scanFile = async () => {
      try {
        // Step 1: Scanning... read locally to bypass Cloudflare Worker CPU limits
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const localPageCount = pdfDoc.getPageCount();

        if (!mounted) return;
        setStatus('reading');
        
        // Step 2: Upload and verify pages via Worker API
        const uploadResult = await workerClient.uploadDocument(file, serviceType, localPageCount.toString());
        if (!mounted) return;
        
        setStatus('success');
        setPages(uploadResult.pageCount);
        
        // Brief pause before reporting back to parent
        setTimeout(() => {
          if (mounted) onScanComplete(uploadResult.pageCount, uploadResult.id);
        }, 600);
        
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setStatus('error');
      }
    };
    
    scanFile();
    
    return () => { mounted = false; };
  }, [file, serviceType, onScanComplete]);

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
        {status === 'scanning' && 'Scanning your document...'}
        {status === 'reading' && 'Reading pages...'}
        {status === 'success' && 'Preparing print options...'}
        {status === 'error' && "Couldn't read page count"}
      </h3>
      
      {status === 'error' && (
        <button 
          onClick={onScanFailed}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
