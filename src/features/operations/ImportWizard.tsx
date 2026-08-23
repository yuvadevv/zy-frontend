import React, { useState, useRef } from 'react';
import { adminClient } from '@/lib/api/adminClient';
import { parseExcelImport, generateImportTemplate } from './ExportGenerator';
import { Upload, AlertCircle, CheckCircle, FileSpreadsheet, X, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ImportWizard({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      try {
        const rows = await parseExcelImport(selectedFile);
        setParsedRows(rows as any[]);
        setStep(2);
      } catch (err) {
        toast.error("Failed to parse Excel file");
      }
    }
  };

  const handleValidate = async () => {
    try {
      setIsProcessing(true);
      const res = await adminClient.validateImport(parsedRows);
      setValidationResult(res);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || 'Validation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = async () => {
    if (!validationResult || validationResult.valid === 0) return;
    try {
      setIsProcessing(true);
      // Construct updates array from validation results
      const validRows = validationResult.rows.filter((r: any) => r.isValid && r.changes.length > 0);
      const updates = validRows.map((r: any) => {
        const originalRow = parsedRows.find(pr => pr.orderId === r.orderId);
        return {
          orderId: r.orderId,
          status: originalRow.status,
          estimatedDelivery: originalRow.estimatedDelivery,
          deliveryType: originalRow.deliveryType,
          deliveryBuilding: originalRow.deliveryBuilding,
          deliveryRoom: originalRow.deliveryRoom
        };
      });

      const res = await adminClient.commitImport(updates);
      toast.success(`${res.results.updated} orders updated successfully.`);
      if (res.results.skipped > 0 || res.results.failures.length > 0) {
         toast.error(`${res.results.skipped} skipped or failed.`);
      }
      onComplete();
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Import Orders</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>

        {/* Wizard Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <FileSpreadsheet className="w-16 h-16 text-blue-500 mb-2"/>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Excel File</h3>
                <p className="text-sm text-gray-500">Only .xlsx files are supported. Financial fields are read-only.</p>
              </div>
              
              <input type="file" accept=".xlsx" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              <div className="flex gap-4">
                <button 
                  onClick={() => generateImportTemplate()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4"/> Template
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4"/> Select File
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800">
                <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold">File Parsed Successfully</h4>
                  <p className="text-sm opacity-90">Found {parsedRows.length} valid rows to process. We need to validate these against the database before committing.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
                <button 
                  onClick={handleValidate} 
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? 'Validating...' : 'Validate Import'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && validationResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Import Preview</h3>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 font-bold mb-1">TOTAL ROWS</div>
                  <div className="text-xl font-bold">{validationResult.rows.length}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-green-700 font-bold mb-1">VALID</div>
                  <div className="text-xl font-bold text-green-700">{validationResult.valid}</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="text-xs text-amber-700 font-bold mb-1">WARNINGS</div>
                  <div className="text-xl font-bold text-amber-700">{validationResult.warnings}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="text-xs text-red-700 font-bold mb-1">ERRORS</div>
                  <div className="text-xl font-bold text-red-700">{validationResult.errors}</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Order ID</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Changes</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {validationResult.rows.map((row: any, i: number) => (
                      <tr key={i} className={!row.isValid ? 'bg-red-50/50' : ''}>
                        <td className="px-4 py-2 font-medium">{row.orderId}</td>
                        <td className="px-4 py-2">
                          {row.changes.map((c: any, j: number) => (
                            <div key={j} className="text-xs text-gray-600">
                              <span className="font-semibold">{c.field}:</span> {c.old} → <span className="font-bold text-gray-900">{c.new}</span>
                            </div>
                          ))}
                          {row.changes.length === 0 && <span className="text-gray-400 italic">No changes</span>}
                        </td>
                        <td className="px-4 py-2">
                          {row.isValid ? (
                            <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">Valid</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">Error</span>
                              <span className="text-xs text-red-600">{row.error}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                <button 
                  onClick={handleCommit} 
                  disabled={isProcessing || validationResult.valid === 0}
                  className="px-6 py-2 bg-[#FF6B00] rounded-lg text-sm font-bold text-white hover:bg-[#E66000] shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? 'Committing...' : `Commit ${validationResult.valid} Updates`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
