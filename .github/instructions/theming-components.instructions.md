---
applyTo: "apps/web/src/theming/components/*.ts"
---

# Theming Component Files (*.ts) Instructions

This document provides guidelines for creating and maintaining styled components using Chakra UI recipes and slot recipes in the `apps/web/src/theming/components` directory.

---

## 🏗️ Architecture Overview

**Tech Stack:**
- **Chakra UI v3** — Design system and component library
- **`defineRecipe`** — For single-element components (Button, Badge, Card, Text, etc.)
- **`defineSlotRecipe`** — For multi-part/compound components (Menu, Dialog, Tabs, etc.)

**Purpose:**
Theming component files define:
- Visual variants for custom components
- Reusable styled components via recipes
- Compound components for multi-part UI patterns

---

## 📂 File Organization

**Naming Conventions:**
- File: `{component}.ts`
- Recipe export: `{component}Recipe`
- Slot recipe export: `{component}SlotRecipe`
- Component export: `{Component}` (PascalCase)

---

## 🔧 Recipe Pattern (Single-Part Components)

Use `defineRecipe` for components that style a single HTML element.

### Structure

```typescript
'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const componentRecipe = defineRecipe({
  // Optional: className prefix for targeting
  className: 'component',
  
  // Base styles applied to all variants
  base: {
    // base styles here
  },
  
  // Variant groups
  variants: {
    variant: {
      primary: { /* styles */ },
      secondary: { /* styles */ },
    },
    size: {
      sm: { /* styles */ },
      md: { /* styles */ },
      lg: { /* styles */ },
    },
    colorPalette: {
      blue: { /* styles */ },
      gold: { /* styles */ },
    },
  },
  
  // Default variants applied when not specified
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
  
  // Compound variants for specific combinations
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      css: { /* override styles */ },
    },
  ],
});

// Create and export ONLY the styled component (recipe stays internal)
export const Component = chakra('element', componentRecipe);
```

### ✅ Correct Example (Button)

```typescript
'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      gradient: {
        bgGradient: 'to-b',
        gradientFrom: 'brand.gold.300',
        gradientTo: 'brand.gold.500',
        color: 'text.primary',
        boxShadow: 'glow.blue',
        fontWeight: '600',
        borderRadius: 'sm',
        transition: '{durations.fast}',
        cursor: 'pointer',
        border: 'none',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glow.hover.blue',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'text.primary',
        border: '1px solid',
        borderColor: 'border.default',
        // ... more styles
      },
    },
    size: {
      sm: { px: 6, py: 2, fontSize: 'sm', h: '10' },
      md: { px: 8, py: 4, fontSize: 'md', h: '14' },
      lg: { px: 10, py: 5, fontSize: 'lg', h: '20' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Export ONLY the component, not the recipe
export const Button = chakra('button', buttonRecipe);
```

### Key Rules for Recipes

1. **Always add `'use client';`** at the top of the file
2. **Export ONLY the styled component** — the recipe stays internal to the file
3. **Use semantic tokens** from the theme (e.g., `text.primary`, `border.default`)
4. **Reference duration tokens** with `{durations.fast}` syntax
5. **Include `_hover`, `_active`, `_focus`** pseudo-states where appropriate
6. **Set `defaultVariants`** to provide sensible defaults

---

## 🔧 Slot Recipe Pattern (Multi-Part/Compound Components)

Use `defineSlotRecipe` for components with multiple styled parts. Chakra UI will apply the styles automatically when the component is registered in the theme.

### Structure

```typescript
'use client';

import { defineSlotRecipe } from '@chakra-ui/react';
import { Component as ChakraComponent } from '@chakra-ui/react';
import { componentAnatomy } from '@chakra-ui/react/anatomy'; // If using existing anatomy

export const componentSlotRecipe = defineSlotRecipe({
  // Optional: className prefix for targeting slots
  className: 'component',
  
  // Define all slots/parts of the component using anatomy or array
  slots: componentAnatomy.keys(), // or ['root', 'content', 'item', 'label']
  
  // Base styles for each slot
  base: {
    root: { /* styles */ },
    content: { /* styles */ },
    item: { /* styles */ },
    label: { /* styles */ },
  },
  
  // Variants applied across slots
  variants: {
    size: {
      sm: {
        root: { /* styles */ },
        item: { /* styles */ },
      },
      md: {
        root: { /* styles */ },
        item: { /* styles */ },
      },
    },
    variant: {
      subtle: {
        root: { /* styles */ },
        content: { /* styles */ },
      },
    },
  },
  
  // Default variants
  defaultVariants: {
    size: 'md',
  },
  
  // Compound variants for slot-specific combinations
  compoundVariants: [
    {
      size: 'sm',
      variant: 'subtle',
      css: {
        root: { /* styles */ },
        item: { /* styles */ },
      },
    },
  ],
});

// Re-export the Chakra component (REQUIRED for slot recipes to work)
export const Component = ChakraComponent;
```

### ✅ Correct Example (Checkbox)

```typescript
'use client';

import { Checkbox as ChakraCheckbox, defineSlotRecipe } from '@chakra-ui/react';
import { checkboxAnatomy } from '@chakra-ui/react/anatomy';

export const checkboxSlotRecipe = defineSlotRecipe({
  className: 'checkbox',
  slots: checkboxAnatomy.keys(),
  base: {
    root: {
      gap: 2,
      alignItems: 'center',
      display: 'flex',
    },
    control: {
      width: '20px',
      height: '20px',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 'sm',
      bg: 'bg.card',
      transition: '{durations.fast}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _hover: {
        borderColor: 'brand.blue.500',
      },
      _checked: {
        bg: 'brand.blue.500',
        borderColor: 'brand.blue.500',
        boxShadow: 'glow.blue',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    label: {
      color: 'text.primary',
      fontSize: 'sm',
      fontWeight: '500',
      cursor: 'pointer',
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      sm: {
        control: { width: '8', height: '8' },
        label: { fontSize: 'sm' },
      },
      md: {
        control: { width: '10', height: '10' },
        label: { fontSize: 'md' },
      },
    },
  },
});

// Re-export the Chakra component (REQUIRED)
export const Checkbox = ChakraCheckbox;
```

### Key Rules for Slot Recipes

1. **Always add `'use client';`** at the top of the file
2. **Define the slot recipe** with `slots`, `base`, `variants`, `defaultVariants`
3. **Export the slot recipe** for theme registration
4. **Re-export the Chakra component** (e.g., `export const Checkbox = ChakraCheckbox;`)
5. **Register the slot recipe in the theme** (`apps/web/src/theming/index.ts`)
6. **Use `anatomy.keys()`** from Chakra when extending existing components
7. **Export the slot recipe from `components/index.ts`** for theme import

---

## 📝 Index File Pattern

Always update `components/index.ts` when adding new components:

```typescript
// Single-part components (only export the component)
export { Badge } from './badge';
export { Button } from './button';
export { Card } from './card';
export { Text } from './text';

// Multi-part components (export the slot recipe)
export { checkboxSlotRecipe } from './checkbox';
export { menuSlotRecipe } from './menu';
export { dialogSlotRecipe } from './dialog';
```

**Then register slot recipes in `apps/web/src/theming/index.ts`:**

```typescript
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { checkboxSlotRecipe, menuSlotRecipe } from './components';

const config = defineConfig({
  theme: {
    // ... other theme config
    slotRecipes: {
      checkbox: checkboxSlotRecipe,
      menu: menuSlotRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
```

**Note:** Components are used directly from Chakra UI. Only slot recipes need theme registration.

**Important:** After updating `apps/web/src/theming/index.ts`, always run:
```bash
pnpm --filter web typegen
```
This regenerates TypeScript types for the theme configuration.

---

## 🚫 Anti-Patterns to Avoid

### ❌ Exporting the recipe instead of the component (for single-part recipes)

```typescript
// WRONG - Don't export the recipe, export the component
export const buttonRecipe = defineRecipe({ /* ... */ });

// CORRECT - Export only the component
const buttonRecipe = defineRecipe({ /* ... */ });
export const Button = chakra('button', buttonRecipe);
```

### ❌ Not exporting the slot recipe (for multi-part components)

```typescript
// WRONG - Slot recipe must be exported
const checkboxSlotRecipe = defineSlotRecipe({ /* ... */ });
export const Checkbox = ChakraCheckbox;

// CORRECT - Export both the slot recipe and re-export the component
export const checkboxSlotRecipe = defineSlotRecipe({ /* ... */ });
export const Checkbox = ChakraCheckbox;
```

### ❌ Not registering slot recipe in theme

```typescript
// WRONG - Slot recipe not in theme config (styles won't apply)
import { createSystem, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    // Missing slotRecipes!
  },
});

// CORRECT - Register all slot recipes
import { checkboxSlotRecipe } from './components';

const config = defineConfig({
  theme: {
    slotRecipes: {
      checkbox: checkboxSlotRecipe,
    },
  },
});
```

### ❌ Hardcoded colors instead of semantic tokens

```typescript
// WRONG
base: {
  bg: '#15151f',      // Hardcoded color
  color: '#ffffff',   // Hardcoded color
}

// CORRECT
base: {
  bg: 'bg.card',      // Semantic token
  color: 'text.primary',
}
```

### ❌ Missing 'use client' directive

```typescript
// WRONG - Will fail in SSR/RSC environment
import { chakra, defineRecipe } from '@chakra-ui/react';

// CORRECT
'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';
```

---

## 📋 Checklist for New Components

### For Recipes (Single-Part):
- [ ] Add `'use client';` directive
- [ ] Import `chakra` and `defineRecipe` from `@chakra-ui/react`
- [ ] Define recipe with `base`, `variants`, `defaultVariants`
- [ ] Create styled component (`const Component = chakra('element', componentRecipe)`)
- [ ] Export ONLY the styled component
- [ ] Update `components/index.ts` to export the component

### For Slot Recipes (Multi-Part):
- [ ] Add `'use client';` directive
- [ ] Import `defineSlotRecipe` and Chakra component from `@chakra-ui/react`
- [ ] Import anatomy if available (e.g., `checkboxAnatomy`)
- [ ] Define slot recipe with `slots`, `base`, `variants`, `defaultVariants`
- [ ] Export the slot recipe (e.g., `export const checkboxSlotRecipe`)
- [ ] Re-export the Chakra component (e.g., `export const Checkbox = ChakraCheckbox;`)
- [ ] Update `components/index.ts` to export the slot recipe
- [ ] Register the slot recipe in `apps/web/src/theming/index.ts` under `slotRecipes`
- [ ] Run `pnpm --filter web typegen` to regenerate theme types

---

## 🔗 Reference Documentation

- [Chakra UI Recipes](https://chakra-ui.com/docs/theming/recipes)
- [Chakra UI Slot Recipes](https://chakra-ui.com/docs/theming/slot-recipes)
- [Chakra UI Semantic Tokens](https://chakra-ui.com/docs/theming/semantic-tokens)
