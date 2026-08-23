import React from 'react';
import { OrderItem } from '../types';
import { FileText } from 'lucide-react';

interface PrintDetailsCardProps {
  item: OrderItem;
}

export const PrintDetailsCard = ({ item }: PrintDetailsCardProps) => {
  const { printConfig } = item;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Print Details
      </h3>

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
        <h4 className="font-semibold text-foreground text-sm mb-1">
          {printConfig.manualName || printConfig.documentName || 'Document'}
        </h4>
        <span className="text-xs text-muted-foreground">
          {printConfig.pages} Pages • {printConfig.copies} {printConfig.copies === 1 ? 'Copy' : 'Copies'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm px-2">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Paper Size</span>
          <span className="font-semibold text-foreground uppercase">{printConfig.paperSize}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Color</span>
          <span className="font-semibold text-foreground capitalize">
            {printConfig.color ? 'Color Print' : 'Black & White'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Print Type</span>
          <span className="font-semibold text-foreground capitalize">
            {printConfig.singleSided ? 'Single Sided' : 'Double Sided'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Binding</span>
          <span className="font-semibold text-foreground capitalize">{printConfig.bindingType}</span>
        </div>
      </div>

      {printConfig.studentNotes && (
        <div className="mt-2 pt-4 border-t border-border/50 flex flex-col gap-1 px-2">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Notes</span>
          <p className="text-sm text-foreground italic">&quot;{printConfig.studentNotes}&quot;</p>
        </div>
      )}
    </div>
  );
};
