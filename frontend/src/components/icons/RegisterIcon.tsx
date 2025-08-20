import React from 'react';

interface RegisterIconProps {
  className?: string;
  size?: number;
}

export const RegisterIcon: React.FC<RegisterIconProps> = ({
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
        <linearGradient id="registerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Main circle background with subtle gradient */}
      <circle cx="40" cy="40" r="36" fill="url(#registerGradient)" opacity="0.08" />
      
      {/* Outer ring for depth */}
      <circle cx="40" cy="40" r="34" stroke="url(#registerGradient)" strokeWidth="1" opacity="0.2" fill="none" />

      {/* User silhouette with gradient */}
      <circle cx="40" cy="28" r="8" fill="url(#userGradient)" filter="url(#shadow)" />
      
      {/* User body with gradient */}
      <path
        d="M24 60C24 50.0589 31.0589 42 41 42C50.9411 42 58 50.0589 58 60"
        stroke="url(#userGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#shadow)"
      />

      {/* Plus sign for registration - more prominent */}
      <rect 
        x="35" 
        y="15" 
        width="10" 
        height="3" 
        rx="1.5" 
        fill="url(#userGradient)" 
        filter="url(#shadow)"
      />
      <rect 
        x="42.5" 
        y="12" 
        width="3" 
        height="9" 
        rx="1.5" 
        fill="url(#userGradient)" 
        filter="url(#shadow)"
      />

      {/* Decorative elements for professional look */}
      <circle cx="40" cy="40" r="28" stroke="url(#registerGradient)" strokeWidth="0.5" opacity="0.15" fill="none" />
      <circle cx="40" cy="40" r="22" stroke="url(#registerGradient)" strokeWidth="0.5" opacity="0.1" fill="none" />

      {/* Subtle dots for visual interest */}
      <circle cx="25" cy="25" r="1.5" fill="url(#registerGradient)" opacity="0.4" />
      <circle cx="55" cy="25" r="1.5" fill="url(#registerGradient)" opacity="0.4" />
      <circle cx="25" cy="55" r="1.5" fill="url(#registerGradient)" opacity="0.4" />
      <circle cx="55" cy="55" r="1.5" fill="url(#registerGradient)" opacity="0.4" />
      
      {/* Additional accent dots */}
      <circle cx="30" cy="35" r="1" fill="url(#registerGradient)" opacity="0.3" />
      <circle cx="50" cy="35" r="1" fill="url(#registerGradient)" opacity="0.3" />
    </svg>
  );
}; 