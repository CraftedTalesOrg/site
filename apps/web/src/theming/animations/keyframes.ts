import { CssKeyframes } from '@chakra-ui/react';

export const keyframes: CssKeyframes = {
  /**
   * Floating animation variant 1
   * Used for hero floating cards - subtle vertical movement with rotation
   */
  float1: {
    '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
    '50%': { transform: 'translateY(-15px) rotate(0deg)' },
  },

  /**
   * Floating animation variant 2
   * Used for hero floating cards - subtle vertical movement with rotation
   */
  float2: {
    '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
    '50%': { transform: 'translateY(-20px) rotate(1deg)' },
  },

  /**
   * Floating animation variant 3
   * Used for hero floating cards - subtle vertical movement with rotation
   */
  float3: {
    '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
    '50%': { transform: 'translateY(-10px) rotate(1deg)' },
  },

  /**
   * Pulse animation
   * Used for CTA section background glow effect
   */
  pulse: {
    '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
    '50%': { transform: 'scale(1.1)', opacity: '1' },
  },

  /**
   * Spin animation
   * Utility animation for loading states and icons
   */
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;
