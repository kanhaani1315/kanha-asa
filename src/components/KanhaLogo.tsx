import React from 'react';

interface KanhaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const KanhaLogo: React.FC<KanhaLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none"
      >
        <defs>
          {/* Gold gradients */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7A1E" />
            <stop offset="100%" stopColor="#E5C158" />
          </linearGradient>

          <linearGradient id="goldBevel" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8C6212" />
            <stop offset="50%" stopColor="#F5D77F" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>

          {/* Deep Emerald Green */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#134E3E" />
            <stop offset="50%" stopColor="#0A3327" />
            <stop offset="100%" stopColor="#06241B" />
          </linearGradient>

          <filter id="shadowGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Circular Base */}
        <circle cx="100" cy="100" r="94" fill="#0A0F0D" />
        <circle cx="100" cy="100" r="92" stroke="url(#goldGrad)" strokeWidth="2.5" />

        {/* Sacred Geometry / Outer Ring with Petals */}
        <circle cx="100" cy="100" r="82" fill="#FAF8F5" stroke="url(#goldGrad)" strokeWidth="3" />

        {/* Decorative Emerald Outer Leaves (8 symmetry points) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={i}
            d="M100 12 C108 26 112 36 100 48 C88 36 92 26 100 12 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}

        {/* Inner Circular Frame */}
        <circle cx="100" cy="100" r="66" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="3.5" filter="url(#shadowGlow)" />
        <circle cx="100" cy="100" r="62" stroke="#E6C875" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />

        {/* Royal Crown on Top */}
        <g transform="translate(100, 52) scale(0.65)" filter="url(#shadowGlow)">
          <path
            d="M-22 0 L-26 -16 L-10 -7 L0 -24 L10 -7 L26 -16 L22 0 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldBevel)"
            strokeWidth="1.5"
          />
          <circle cx="-26" cy="-17" r="2.5" fill="#FFF2B2" />
          <circle cx="0" cy="-25" r="3" fill="#FFF2B2" />
          <circle cx="26" cy="-17" r="2.5" fill="#FFF2B2" />
          <circle cx="0" cy="-8" r="2" fill="#0A3327" />
        </g>

        {/* Lotus at Bottom */}
        <g transform="translate(100, 146) scale(0.65)">
          <path
            d="M0 -12 C6 -5 12 2 0 10 C-12 2 -6 -5 0 -12 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldBevel)"
            strokeWidth="1"
          />
          <path
            d="M-1 -8 C-10 -3 -18 3 -12 11 C-4 10 -2 0 -1 -8 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldBevel)"
            strokeWidth="1"
          />
          <path
            d="M1 -8 C10 -3 18 3 12 11 C4 10 2 0 1 -8 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldBevel)"
            strokeWidth="1"
          />
        </g>

        {/* Centered Stylized "K A" Monogram */}
        <g transform="translate(100, 102)" filter="url(#shadowGlow)">
          {/* Letter K */}
          <path
            d="M-42 -35 L-24 -35 L-24 35 L-42 35 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
          />
          {/* K Upper Diagonal */}
          <path
            d="M-24 -5 L14 -35 L30 -35 L-8 6 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
          />
          {/* K / A Lower Diagonal Sweeping Leg */}
          <path
            d="M-12 2 L26 35 L44 35 C32 20 18 10 6 3 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
          />

          {/* Letter A Intertwined */}
          <path
            d="M-8 35 L12 -22 L24 -22 L40 35 L26 35 L20 14 L-2 14 L-5 35 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="2"
          />
          {/* A inner triangle */}
          <polygon points="9,-4 17,-4 13,-14" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="1.2" />
        </g>

        {/* 4 Sacred Medallions with Numbers 1, 3, 6, 9 */}
        {/* Top: 1 */}
        <g transform="translate(100, 16)">
          <circle cx="0" cy="0" r="14" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="2.5" filter="url(#shadowGlow)" />
          <text x="0" y="5" textAnchor="middle" fill="#0A3327" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif">
            1
          </text>
        </g>

        {/* Right: 3 */}
        <g transform="translate(184, 100)">
          <circle cx="0" cy="0" r="14" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="2.5" filter="url(#shadowGlow)" />
          <text x="0" y="5" textAnchor="middle" fill="#0A3327" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif">
            3
          </text>
        </g>

        {/* Bottom: 6 */}
        <g transform="translate(100, 184)">
          <circle cx="0" cy="0" r="14" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="2.5" filter="url(#shadowGlow)" />
          <text x="0" y="5" textAnchor="middle" fill="#0A3327" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif">
            6
          </text>
        </g>

        {/* Left: 9 */}
        <g transform="translate(16, 100)">
          <circle cx="0" cy="0" r="14" fill="#FDFBF7" stroke="url(#goldGrad)" strokeWidth="2.5" filter="url(#shadowGlow)" />
          <text x="0" y="5" textAnchor="middle" fill="#0A3327" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif">
            9
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-wider text-amber-400 leading-tight">
            KANHA ASA
          </span>
          <span className="text-[10px] text-amber-200/80 font-serif-luxury tracking-widest uppercase">
            Astro & Rudraksha · ISO 9001:2015
          </span>
        </div>
      )}
    </div>
  );
};
