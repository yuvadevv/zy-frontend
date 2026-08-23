// src/features/profile/components/ProfileAvatar.tsx
import React from 'react';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfileAvatar = ({ name, avatarUrl, size = 'md' }: ProfileAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 overflow-hidden`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        name ? getInitials(name) : <User className="w-1/2 h-1/2 opacity-50" />
      )}
    </div>
  );
};
