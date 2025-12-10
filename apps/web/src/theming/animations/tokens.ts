export const animationTokens = {
  /**
   * Floating card animation variant 1
   * Duration: 6s, Timing: ease-in-out, Iteration: infinite
   * Used for first hero floating card
   */
  floatingCard1: {
    value: 'float1 6s ease-in-out infinite',
  },

  /**
   * Floating card animation variant 2
   * Duration: 7s, Timing: ease-in-out, Iteration: infinite
   * Used for second hero floating card
   */
  floatingCard2: {
    value: 'float2 7s ease-in-out infinite',
  },

  /**
   * Floating card animation variant 3
   * Duration: 8s, Timing: ease-in-out, Iteration: infinite
   * Used for third hero floating card
   */
  floatingCard3: {
    value: 'float3 8s ease-in-out infinite',
  },

  /**
   * Pulse glow animation
   * Duration: 4s, Timing: ease-in-out, Iteration: infinite
   * Used for CTA section background effect
   */
  pulseGlow: {
    value: 'pulse 4s ease-in-out infinite',
  },

  /**
   * Spin animation
   * Duration: 1s, Timing: linear, Iteration: infinite
   * Utility for loading states
   */
  spin: {
    value: 'spin 1s linear infinite',
  },
} as const;
