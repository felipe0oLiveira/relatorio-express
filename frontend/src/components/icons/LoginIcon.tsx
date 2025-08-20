import React from 'react';

interface LoginIconProps {
  className?: string;
  size?: number;
}

export const LoginIcon: React.FC<LoginIconProps> = ({
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
        <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Main circle background with subtle gradient */}
      <circle cx="40" cy="40" r="36" fill="url(#loginGradient)" opacity="0.08" />
      
      {/* Outer ring for depth */}
      <circle cx="40" cy="40" r="34" stroke="url(#loginGradient)" strokeWidth="1" opacity="0.2" fill="none" />

      {/* Lock body with gradient */}
      <rect 
        x="28" 
        y="32" 
        width="24" 
        height="20" 
        rx="4" 
        fill="url(#lockGradient)" 
        filter="url(#shadow)"
      />

      {/* Lock shackle with gradient */}
      <path
        d="M32 32V24C32 18.4772 36.4772 14 42 14C47.5228 14 52 18.4772 52 24V32"
        stroke="url(#lockGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        filter="url(#shadow)"
      />

      {/* Keyhole with white fill for contrast */}
      <circle cx="40" cy="40" r="3" fill="white" opacity="0.9" />
      <rect x="38" y="40" width="4" height="6" fill="white" opacity="0.9" />

      {/* Decorative elements for professional look */}
      <circle cx="40" cy="40" r="28" stroke="url(#loginGradient)" strokeWidth="0.5" opacity="0.15" fill="none" />
      <circle cx="40" cy="40" r="22" stroke="url(#loginGradient)" strokeWidth="0.5" opacity="0.1" fill="none" />
      
      {/* Subtle dots for visual interest */}
      <circle cx="25" cy="25" r="1.5" fill="url(#loginGradient)" opacity="0.4" />
      <circle cx="55" cy="25" r="1.5" fill="url(#loginGradient)" opacity="0.4" />
      <circle cx="25" cy="55" r="1.5" fill="url(#loginGradient)" opacity="0.4" />
      <circle cx="55" cy="55" r="1.5" fill="url(#loginGradient)" opacity="0.4" />
    </svg>
  );
}; 