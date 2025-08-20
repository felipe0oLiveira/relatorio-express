"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../hooks/useAuth';

export default function ClientAuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Se estiver na página inicial, não usar nenhum provider
  if (pathname === '/') {
    return <>{children}</>;
  }
  
  // Para outras páginas, usar o AuthProvider
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 