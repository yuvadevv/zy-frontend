import { create } from 'zustand';

export interface PendingUpload {
  documentId: string;
  serviceType: string;
  pages: string;
  file: File;
}

export interface FileUploadStore {
  confirmedDocuments: Record<string, boolean>;
  setConfirmedDocument: (documentId: string, confirmed: boolean) => void;
  pendingFiles: Record<string, PendingUpload>;
  setPendingFile: (documentId: string, upload: PendingUpload) => void;
  removePendingFile: (documentId: string) => void;
  clearPendingFiles: () => void;
}

export const useFileUploadStore = create<FileUploadStore>((set) => ({
  confirmedDocuments: {},
  setConfirmedDocument: (documentId, confirmed) =>
    set((state) => ({
      confirmedDocuments: { ...state.confirmedDocuments, [documentId]: confirmed }
    })),
  pendingFiles: {},
  setPendingFile: (documentId, upload) => 
    set((state) => ({
      pendingFiles: { ...state.pendingFiles, [documentId]: upload }
    })),
  removePendingFile: (documentId) =>
    set((state) => {
      const newFiles = { ...state.pendingFiles };
      delete newFiles[documentId];
      return { pendingFiles: newFiles };
    }),
  clearPendingFiles: () => set({ pendingFiles: {}, confirmedDocuments: {} })
}));
