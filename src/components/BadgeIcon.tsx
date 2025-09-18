import React from 'react';

export type BadgeType = 'diamond-international' | 'platinum-national' | 'gold-state' | 'silver-district' | 'bronze-intra-college';

interface BadgeIconProps {
  badge: BadgeType;
  size?: number;
  className?: string;
}

export function BadgeIcon({ badge, size = 20, className = "" }: BadgeIconProps) {
  const iconProps = {
    width: size,
    height: size,
    className: `${className}`,
    viewBox: "0 0 24 24"
  };

  // Generate unique gradient IDs to avoid conflicts
  const gradientId = `${badge}-gradient-${Math.random().toString(36).substr(2, 9)}`;

  switch (badge) {
    case 'diamond-international':
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8F4F8" />
              <stop offset="50%" stopColor="#B8E6FF" />
              <stop offset="100%" stopColor="#87CEEB" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 8l8 14 8-14-8-6z"
            fill={`url(#${gradientId})`}
            stroke="#4A90E2"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L6 8h12L12 2z"
            fill="#87CEEB"
            opacity="0.8"
          />
          <circle cx="12" cy="10" r="1" fill="#4A90E2" />
        </svg>
      );

    case 'platinum-national':
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F5F5" />
              <stop offset="50%" stopColor="#E5E5E5" />
              <stop offset="100%" stopColor="#D3D3D3" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 8l8 14 8-14-8-6z"
            fill={`url(#${gradientId})`}
            stroke="#A9A9A9"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L6 8h12L12 2z"
            fill="#C0C0C0"
            opacity="0.9"
          />
          <circle cx="12" cy="10" r="1" fill="#808080" />
        </svg>
      );

    case 'gold-state':
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 8l8 14 8-14-8-6z"
            fill={`url(#${gradientId})`}
            stroke="#B8860B"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L6 8h12L12 2z"
            fill="#FFD700"
            opacity="0.9"
          />
          <circle cx="12" cy="10" r="1" fill="#B8860B" />
        </svg>
      );

    case 'silver-district':
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8F8FF" />
              <stop offset="50%" stopColor="#C0C0C0" />
              <stop offset="100%" stopColor="#A9A9A9" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 8l8 14 8-14-8-6z"
            fill={`url(#${gradientId})`}
            stroke="#808080"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L6 8h12L12 2z"
            fill="#C0C0C0"
            opacity="0.8"
          />
          <circle cx="12" cy="10" r="1" fill="#696969" />
        </svg>
      );

    case 'bronze-intra-college':
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="50%" stopColor="#CD7F32" />
              <stop offset="100%" stopColor="#A0522D" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L4 8l8 14 8-14-8-6z"
            fill={`url(#${gradientId})`}
            stroke="#8B4513"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L6 8h12L12 2z"
            fill="#CD7F32"
            opacity="0.8"
          />
          <circle cx="12" cy="10" r="1" fill="#8B4513" />
        </svg>
      );

    default:
      return null;
  }
}

export function getBadgeLabel(badge: BadgeType): string {
  switch (badge) {
    case 'diamond-international':
      return 'Diamond - International';
    case 'platinum-national':
      return 'Platinum - National';
    case 'gold-state':
      return 'Gold - State';
    case 'silver-district':
      return 'Silver - District';
    case 'bronze-intra-college':
      return 'Bronze - Intra College';
    default:
      return '';
  }
}

export function getBadgeColor(badge: BadgeType): string {
  switch (badge) {
    case 'diamond-international':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'platinum-national':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'gold-state':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'silver-district':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'bronze-intra-college':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}