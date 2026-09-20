import { create } from 'zustand';

export interface PendingUpload {
  documentId: string;
  serviceType: string;
  pages: string;
  file: File;
}

interface FileUploadStore {
  pendingFiles: Record<string, PendingUpload>;
  setPendingFile: (documentId: string, upload: PendingUpload) => void;
  removePendingFile: (documentId: string) => void;
  clearPendingFiles: () => void;
}

export const useFileUploadStore = create<FileUploadStore>((set) => ({
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
  clearPendingFiles: () => set({ pendingFiles: {} })
}));
