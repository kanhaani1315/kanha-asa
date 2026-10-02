import React from 'react';

export const AiCallingIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="22" fill="#0A3327" stroke="#10B981" strokeWidth="2" />
      {/* AI Voice Soundwaves & Headset */}
      <path d="M12 24C12 20 14 16 16 16" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 24C36 20 34 16 32 16" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="22" y="12" width="4" height="24" rx="2" fill="#FBBF24" />
      <rect x="17" y="16" width="3.5" height="16" rx="1.75" fill="#34D399" />
      <rect x="27.5" y="16" width="3.5" height="16" rx="1.75" fill="#34D399" />
      <circle cx="24" cy="24" r="1.5" fill="#0A3327" />
    </svg>
  );
};

export const KanhaAiChatIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="22" fill="#1C1917" stroke="#F59E0B" strokeWidth="2" />
      {/* Third Eye & AI Core */}
      <path
        d="M12 24 C17 17 31 17 36 24 C31 31 17 31 12 24 Z"
        stroke="#FBBF24"
        strokeWidth="2"
        fill="#292524"
      />
      <circle cx="24" cy="24" r="4.5" fill="#F59E0B" />
      <circle cx="24" cy="24" r="2" fill="#FFFBEB" />
      {/* Numeric spark points */}
      <circle cx="24" cy="13" r="1.5" fill="#34D399" />
      <circle cx="33" cy="33" r="1.5" fill="#34D399" />
      <circle cx="15" cy="33" r="1.5" fill="#34D399" />
    </svg>
  );
};
