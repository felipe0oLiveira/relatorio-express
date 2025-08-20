import React from 'react';

interface UploadIconProps {
  className?: string;
  size?: number;
}

export const UploadIcon: React.FC<UploadIconProps> = ({ 
  className = "text-white", 
  size = 80 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle cx="40" cy="40" r="36" fill="url(#uploadGradient)" opacity="0.1" />
      
      {/* Upload arrow */}
      <path
        d="M40 20L40 50M30 30L40 20L50 30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* File/document */}
      <rect x="28" y="45" width="24" height="20" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="32" y="49" width="16" height="2" fill="white" />
      <rect x="32" y="53" width="12" height="2" fill="white" />
      <rect x="32" y="57" width="14" height="2" fill="white" />
      
      {/* Cloud upload */}
      <path
        d="M25 35C25 30.5817 28.5817 27 33 27C33.5 27 34 27.1 34.5 27.3C35.5 24.8 37.8 23 40.5 23C44.6 23 48 26.4 48 30.5C48 30.8 48 31.1 47.9 31.4C49.8 32.1 51 34 51 36.2C51 38.9 48.9 41 46.2 41H35C31.1 41 28 37.9 28 34C28 30.1 31.1 27 35 27"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Decorative elements */}
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" />
    </svg>
  );
}; 