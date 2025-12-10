/**
 * Animation Styles definitions
 * Reusable animation property compositions
 * Based on ModsTale landing page design
 *
 * Note: Animation styles only support animation-related properties.
 * For transitions, use semantic tokens in the theme config.
 */

import { defineAnimationStyles } from '@chakra-ui/react';

export const animationStyles = defineAnimationStyles({
  /**
   * Floating card animation variant 1
   * Used for first hero floating card
   */
  floatingCard1: {
    value: {
      animationName: 'float1',
      animationDuration: '6s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },

  /**
   * Floating card animation variant 2
   * Used for second hero floating card
   */
  floatingCard2: {
    value: {
      animationName: 'float2',
      animationDuration: '7s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },

  /**
   * Floating card animation variant 3
   * Used for third hero floating card
   */
  floatingCard3: {
    value: {
      animationName: 'float3',
      animationDuration: '8s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },

  /**
   * Pulse glow animation
   * Used for CTA section background effect
   */
  pulseGlow: {
    value: {
      animationName: 'pulse',
      animationDuration: '4s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },

  /**
   * Spin animation
   * Utility for loading states
   */
  spin: {
    value: {
      animationName: 'spin',
      animationDuration: '1s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
});
