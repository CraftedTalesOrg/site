'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const textRecipe = defineRecipe({
  base: {
    fontFamily: 'body',
    color: 'text.primary',
  },
  variants: {
    variant: {
      // === UNIQUE CONTEXT-SPECIFIC VARIANTS ===
      heroTitle: {
        fontSize: { base: '2.25rem', sm: '2.75rem', md: '4rem' },
        fontWeight: '700',
        fontFamily: 'heading',
        lineHeight: '1.1',
        color: 'text.primary',
      },
      heroSubtitle: {
        fontSize: { base: '1rem', md: '1.2rem' },
        color: 'text.secondary',
      },
      statValue: {
        fontSize: { base: '1.75rem', sm: '2rem', md: '2.5rem' },
        fontWeight: '700',
        fontFamily: 'heading',
        color: 'brand.blue.500',
      },
      statLabel: {
        fontSize: '0.85rem',
        color: 'text.muted',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      },
      brandLogo: {
        fontSize: '2xl',
        fontWeight: 'bold',
        fontFamily: 'heading',
        color: 'text.primary',
      },

      // === NORMALIZED SEMANTIC VARIANTS ===
      sectionTitle: {
        fontSize: { base: '2rem', md: '2.75rem' },
        fontWeight: '700',
        fontFamily: 'heading',
        color: 'text.primary',
      },
      cardTitle: {
        fontSize: '1.35rem',
        fontWeight: '600',
        fontFamily: 'heading',
        color: 'text.primary',
      },
      subtitle: {
        fontSize: { base: '0.95rem', md: '1.1rem' },
        color: 'text.secondary',
      },
      cardBody: {
        fontSize: '0.95rem',
        color: 'text.secondary',
      },
      caption: {
        fontSize: '0.85rem',
        color: 'text.muted',
      },
      footerSectionTitle: {
        fontSize: 'lg',
        fontWeight: 'semibold',
        fontFamily: 'heading',
        color: 'text.primary',
      },
    },
  },
  defaultVariants: {
    variant: 'cardBody',
  },
});

export const Text = chakra('p', textRecipe);
