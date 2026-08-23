import React from 'react';
import { PackageX } from 'lucide-react';
import { Button } from '@/design-system/components/buttons/Button/Button';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/routes';

export const OrderEmptyState = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <PackageX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Order Found</h3>
      <p className="text-muted-foreground mb-8 max-w-sm">
        We couldn&apos;t find the order you&apos;re looking for. It might have been deleted or the link is invalid.
      </p>
      <Button onClick={() => router.push(APP_ROUTES.HOME)}>
        Go to Dashboard
      </Button>
    </div>
  );
};
