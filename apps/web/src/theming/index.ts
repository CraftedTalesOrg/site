import {
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';
import {
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  headingRecipe,
  iconContainerRecipe,
} from './components';

const config = defineConfig({
  theme: {
    breakpoints: {
      'sm': '320px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      '2xl': '1400px',
    },
    tokens: {
      colors: {
        // Brand colors based on ModsTale design
        brand: {
          blue: {
            50: { value: '#eef4fe' },
            100: { value: '#dde9fd' },
            200: { value: '#bbd3fb' },
            300: { value: '#99bdf9' },
            400: { value: '#77a7f7' },
            500: { value: '#2769e1' }, // accent-blue
            600: { value: '#1f54b4' },
            700: { value: '#173f87' },
            800: { value: '#102a5a' },
            900: { value: '#08152d' },
          },
          gold: {
            50: { value: '#fef9f0' },
            100: { value: '#fdf3e0' },
            200: { value: '#fbe7c1' },
            300: { value: '#f5d59f' },
            400: { value: '#edb760' },
            500: { value: '#e19f27' }, // accent-gold
            600: { value: '#c98a1f' },
            700: { value: '#a67018' },
            800: { value: '#835811' },
            900: { value: '#60400c' },
          },
          orange: {
            50: { value: '#fff7ed' },
            100: { value: '#ffedd5' },
            200: { value: '#fed7aa' },
            300: { value: '#fdba74' },
            400: { value: '#fb923c' },
            500: { value: '#ff6b35' }, // accent-orange
            600: { value: '#ea580c' },
            700: { value: '#c2410c' },
            800: { value: '#9a3412' },
            900: { value: '#7c2d12' },
          },
          green: {
            50: { value: '#ecfdf5' },
            100: { value: '#d1fae5' },
            200: { value: '#a7f3d0' },
            300: { value: '#6ee7b7' },
            400: { value: '#34d399' },
            500: { value: '#10b981' }, // accent-green
            600: { value: '#059669' },
            700: { value: '#047857' },
            800: { value: '#065f46' },
            900: { value: '#064e3b' },
          },
        },
        // Background colors
        bg: {
          primary: { value: '#0a0a0f' },
          secondary: { value: '#12121a' },
          tertiary: { value: '#1a1a26' },
          card: { value: '#15151f' },
        },
        // Text colors
        text: {
          primary: { value: '#ffffff' },
          secondary: { value: '#a0a0b0' },
          muted: { value: '#6b6b7b' },
        },
        // Border color
        border: {
          base: { value: '#2a2a3a' },
          default: { value: '#2a2a3a' },
        },
        // Alpha variants for backgrounds
        alpha: {
          blue: {
            10: { value: 'rgba(39, 105, 225, 0.1)' },
            15: { value: 'rgba(39, 105, 225, 0.15)' },
            25: { value: 'rgba(39, 105, 225, 0.25)' },
          },
          gold: {
            10: { value: 'rgba(225, 159, 39, 0.1)' },
            15: { value: 'rgba(225, 159, 39, 0.15)' },
            25: { value: 'rgba(225, 159, 39, 0.25)' },
          },
          green: {
            10: { value: 'rgba(16, 185, 129, 0.1)' },
            15: { value: 'rgba(16, 185, 129, 0.15)' },
            25: { value: 'rgba(16, 185, 129, 0.25)' },
          },
          orange: {
            10: { value: 'rgba(255, 107, 53, 0.1)' },
            15: { value: 'rgba(255, 107, 53, 0.15)' },
            25: { value: 'rgba(255, 107, 53, 0.25)' },
          },
        },
      },
      fonts: {
        heading: { value: '"Lexend", sans-serif' },
        body: { value: '"Lexend", sans-serif' },
      },
      fontSizes: {
        'xs': { value: '0.7rem' },
        'sm': { value: '0.85rem' },
        'md': { value: '0.95rem' },
        'lg': { value: '1.1rem' },
        'xl': { value: '1.35rem' },
        '2xl': { value: '1.75rem' },
        '3xl': { value: '2.5rem' },
        '4xl': { value: '2.75rem' },
        '5xl': { value: '4rem' },
      },
      fontWeights: {
        normal: { value: 400 },
        medium: { value: 500 },
        semibold: { value: 600 },
        bold: { value: 700 },
      },
      radii: {
        'sm': { value: '8px' },
        'md': { value: '12px' },
        'lg': { value: '16px' },
        'xl': { value: '20px' },
        '2xl': { value: '24px' },
      },
      shadows: {
        'glow': {
          blue: { value: '0 0 30px rgba(39, 105, 225, 0.3)' },
          gold: { value: '0 0 30px rgba(225, 159, 39, 0.3)' },
          green: { value: '0 0 30px rgba(16, 185, 129, 0.2)' },
        },
        'glow.hover': {
          blue: { value: '0 0 40px rgba(39, 105, 225, 0.5)' },
          gold: { value: '0 0 40px rgba(225, 159, 39, 0.5)' },
          green: { value: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        'card': {
          elevated: { value: '0 20px 50px rgba(0, 0, 0, 0.5)' },
        },
      },
      gradients: {
        'primary': { value: 'linear-gradient(135deg, {colors.brand.blue.500}, {colors.brand.gold.500})' },
        'primary.subtle': { value: 'linear-gradient(135deg, rgba(39, 105, 225, 0.15), rgba(225, 159, 39, 0.15))' },
        'primary.subtle.hover': { value: 'linear-gradient(135deg, rgba(39, 105, 225, 0.25), rgba(225, 159, 39, 0.25))' },
        'feature': { value: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(39, 105, 225, 0.15))' },
        'feature.hover': { value: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(39, 105, 225, 0.25))' },
      },
    },
    semanticTokens: {
      colors: {
        // Blue brand tokens
        'brand.blue': {
          solid: { value: '{colors.brand.blue.500}' },
          contrast: { value: '{colors.text.primary}' },
          fg: { value: '{colors.brand.blue.500}' },
          muted: { value: '{colors.brand.blue.100}' },
          subtle: { value: '{colors.brand.blue.200}' },
          emphasized: { value: '{colors.brand.blue.300}' },
          focusRing: { value: '{colors.brand.blue.500}' },
        },
        // Gold brand tokens
        'brand.gold': {
          solid: { value: '{colors.brand.gold.500}' },
          contrast: { value: '{colors.text.primary}' },
          fg: { value: '{colors.brand.gold.500}' },
          muted: { value: '{colors.brand.gold.100}' },
          subtle: { value: '{colors.brand.gold.200}' },
          emphasized: { value: '{colors.brand.gold.300}' },
          focusRing: { value: '{colors.brand.gold.500}' },
        },
        // Orange brand tokens
        'brand.orange': {
          solid: { value: '{colors.brand.orange.500}' },
          contrast: { value: '{colors.text.primary}' },
          fg: { value: '{colors.brand.orange.500}' },
          muted: { value: '{colors.brand.orange.100}' },
          subtle: { value: '{colors.brand.orange.200}' },
          emphasized: { value: '{colors.brand.orange.300}' },
          focusRing: { value: '{colors.brand.orange.500}' },
        },
        // Green brand tokens
        'brand.green': {
          solid: { value: '{colors.brand.green.500}' },
          contrast: { value: '{colors.text.primary}' },
          fg: { value: '{colors.brand.green.500}' },
          muted: { value: '{colors.brand.green.100}' },
          subtle: { value: '{colors.brand.green.200}' },
          emphasized: { value: '{colors.brand.green.300}' },
          focusRing: { value: '{colors.brand.green.500}' },
        },
      },
    },
    keyframes: {
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
      float1: {
        '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
        '50%': { transform: 'translateY(-15px) rotate(0deg)' },
      },
      float2: {
        '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
        '50%': { transform: 'translateY(-20px) rotate(1deg)' },
      },
      float3: {
        '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
        '50%': { transform: 'translateY(-10px) rotate(1deg)' },
      },
      pulse: {
        '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
        '50%': { transform: 'scale(1.1)', opacity: '1' },
      },
    },
    recipes: {
      badge: badgeRecipe,
      button: buttonRecipe,
      card: cardRecipe,
      heading: headingRecipe,
      iconContainer: iconContainerRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
