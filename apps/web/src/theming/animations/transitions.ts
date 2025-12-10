export const transitionTokens = {
  /**
   * Fast transition - 0.3s ease
   * Used for: nav links, buttons, search box, footer links
   */
  fast: {
    value: 'all 0.3s ease',
  },

  /**
   * Medium transition - 0.4s ease
   * Used for: category cards, mod cards, feature cards
   */
  medium: {
    value: 'all 0.4s ease',
  },

  /**
   * Slow transition - 0.5s ease
   * Used for: floating cards, complex animations
   */
  slow: {
    value: 'all 0.5s ease',
  },

  /**
   * Color transition - 0.3s ease
   * Specific for color/text changes
   */
  color: {
    value: 'color 0.3s ease',
  },

  /**
   * Width transition - 0.3s ease
   * Used for underline expansions
   */
  width: {
    value: 'width 0.3s ease',
  },
} as const;
