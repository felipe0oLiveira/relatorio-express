import React from 'react';

interface DashboardIconProps {
  className?: string;
  size?: number;
}

export const DashboardIcon: React.FC<DashboardIconProps> = ({ 
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
        <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle cx="40" cy="40" r="36" fill="url(#dashboardGradient)" opacity="0.1" />
      
      {/* Dashboard grid */}
      <rect x="20" y="20" width="16" height="16" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="44" y="20" width="16" height="16" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="20" y="44" width="16" height="16" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="44" y="44" width="16" height="16" rx="2" fill="currentColor" opacity="0.2" />
      
      {/* Chart bars */}
      <rect x="24" y="28" width="2" height="4" fill="white" />
      <rect x="28" y="26" width="2" height="6" fill="white" />
      <rect x="32" y="24" width="2" height="8" fill="white" />
      
      <rect x="48" y="30" width="2" height="2" fill="white" />
      <rect x="52" y="28" width="2" height="4" fill="white" />
      <rect x="56" y="26" width="2" height="6" fill="white" />
      
      <rect x="24" y="52" width="2" height="2" fill="white" />
      <rect x="28" y="50" width="2" height="4" fill="white" />
      <rect x="32" y="48" width="2" height="6" fill="white" />
      
      <rect x="48" y="54" width="2" height="2" fill="white" />
      <rect x="52" y="52" width="2" height="4" fill="white" />
      <rect x="56" y="50" width="2" height="6" fill="white" />
      
      {/* Decorative elements */}
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" />
    </svg>
  );
}; 