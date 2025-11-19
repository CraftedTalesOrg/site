import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from '@tamagui/core';
import { themes } from './themes';

export const config = createTamagui({
  ...defaultConfig,
  themes,
  shorthands: {
    ai: 'alignItems',
    jc: 'justifyContent',
    bg: 'backgroundColor',
    br: 'borderRadius',
    p: 'padding',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    w: 'width',
    h: 'height',
    minW: 'minWidth',
    maxW: 'maxWidth',
    minH: 'minHeight',
    maxH: 'maxHeight',
  } as const,
  settings: { allowedStyleValues: 'somewhat-strict' },
});

export type CraftedTalesUIConfig = typeof config;
