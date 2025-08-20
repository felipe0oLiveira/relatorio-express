'use client';

import { useState } from 'react';

interface DataQualityBadgeProps {
  issueCount: number;
  issueType?: string;
  onDismiss?: () => void;
  showDismissButton?: boolean;
}

export default function DataQualityBadge({ 
  issueCount, 
  issueType = 'Issues', 
  onDismiss, 
  showDismissButton = true 
}: DataQualityBadgeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="inline-flex items-center bg-red-500 text-white rounded-full px-3 py-1.5 text-sm font-medium shadow-sm">
      {/* Ícone circular com inicial */}
      <div className="flex items-center justify-center w-6 h-6 bg-red-400 rounded-full mr-2">
        <span className="text-white font-bold text-xs">N</span>
      </div>
      
      {/* Texto do badge */}
      <span className="mr-2">{issueCount} {issueType}</span>
      
      {/* Botão de fechar */}
      {showDismissButton && (
        <button
          onClick={handleDismiss}
          className="ml-1 p-0.5 hover:bg-red-600 rounded-full transition-colors duration-200"
          title="Remover filtro"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}






