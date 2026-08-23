import React from 'react';
import { Manual } from '../types';

interface ManualDetailsProps {
  manual: Manual;
}

export const ManualDetails = ({ manual }: ManualDetailsProps) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* PDF Thumbnail Stack Preview */}
      <div className="w-full flex justify-center py-6">
        <div className="relative w-32 h-44">
          <div className="absolute inset-0 bg-primary/20 rounded-lg shadow-sm transform translate-x-3 translate-y-3 rotate-6"></div>
          <div className="absolute inset-0 bg-secondary rounded-lg shadow-sm transform translate-x-1 translate-y-1 rotate-2 border border-border"></div>
          <div className="absolute inset-0 bg-background rounded-lg shadow-md border border-border/50 flex flex-col items-center p-3">
            <div className="w-full h-2 bg-muted rounded-full mb-2"></div>
            <div className="w-3/4 h-2 bg-muted rounded-full mb-4"></div>
            <div className="flex-1 w-full bg-secondary/50 rounded flex items-center justify-center border border-border/30">
              <span className="text-primary font-black text-xs opacity-50 uppercase tracking-widest">PDF</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground leading-tight">{manual.name}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {manual.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Pages</span>
          <span className="font-semibold text-foreground">{manual.pages}</span>
        </div>
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Language</span>
          <span className="font-semibold text-foreground">{manual.language}</span>
        </div>
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Updated</span>
          <span className="font-semibold text-foreground">
            {new Date(manual.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Uploaded By</span>
          <span className="font-semibold text-foreground">{manual.uploadedBy || 'Admin'}</span>
        </div>
      </div>
    </div>
  );
};
