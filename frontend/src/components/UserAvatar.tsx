'use client';

import { useAuth } from '@/components/AuthProvider';

export default function UserAvatar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="text-primary w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
        {user.username.charAt(0).toUpperCase()}{user.username.substring(1)}
      </div>
    </div>
  );
}