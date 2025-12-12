'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';
import { Timeline as ChakraTimeline } from '@chakra-ui/react';

export const timelineTitleRecipe = defineRecipe({
  base: {
    color: 'text.primary',
    fontWeight: 'semibold',
    fontSize: 'lg',
  },
});

export const timelineDescriptionRecipe = defineRecipe({
  base: {
    color: 'text.secondary',
    fontSize: 'xs',
  },
});

export const TimelineTitle = chakra(ChakraTimeline.Title, timelineTitleRecipe);
export const TimelineDescription = chakra(ChakraTimeline.Description, timelineDescriptionRecipe);
