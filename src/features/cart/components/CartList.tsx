import React from 'react';
import { CartItem as ICartItem } from '../types';
import { CartItem } from './CartItem';
import { EmptyCart } from './EmptyCart';

interface CartListProps {
  items: ICartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export const CartList = ({ items, onUpdateQuantity, onRemove, onEdit }: CartListProps) => {
  if (!items || items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map(item => (
        <CartItem 
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
