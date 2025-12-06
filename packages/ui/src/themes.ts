import { tokens } from './tokens';

// Light theme using $tokenName CSS variable references
// Scale: 1=bg, 2=subtle bg, 3=UI bg, 4=hover UI, 5=active UI, 6=subtle border, 7=strong border, 8=hover border, 9=primary, 10=hover primary, 11=subtle text, 12=text
const light = {
  background: tokens.color.light1,
  backgroundHover: tokens.color.light4,
  backgroundPress: tokens.color.light5,
  backgroundFocus: tokens.color.light4,
  backgroundStrong: tokens.color.light3,
  backgroundTransparent: 'rgba(0,0,0,0)',
  backgroundSubtle: tokens.color.light2,

  color: tokens.color.light12,
  colorHover: tokens.color.light12,
  colorPress: tokens.color.light11,
  colorFocus: tokens.color.light12,
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: tokens.color.light6,
  borderColorHover: tokens.color.light8,
  borderColorFocus: tokens.color.light7,
  borderColorPress: tokens.color.light7,

  placeholderColor: tokens.color.light11,
  outlineColor: tokens.color.light7,

  // Semantic colors
  primary: tokens.color.light9,
  primaryHover: tokens.color.light10,
  muted: tokens.color.light3,
  mutedForeground: tokens.color.light11,
  accent: tokens.color.accentLight9,
  accentHover: tokens.color.accentLight10,
  accentForeground: tokens.color.accentLight12,

  // Shadows
  shadowColor: tokens.shadow.light1,
  shadowColorHover: tokens.shadow.light2,
  shadowColorPress: tokens.shadow.light1,
  shadowColorFocus: tokens.shadow.light2,
};

type BaseTheme = typeof light;

// Dark theme
// Scale: 1=bg, 2=subtle bg, 3=UI bg, 4=hover UI, 5=active UI, 6=subtle border, 7=strong border, 8=hover border, 9=primary, 10=hover primary, 11=subtle text, 12=text
export const dark: BaseTheme = {
  background: tokens.color.dark1,
  backgroundHover: tokens.color.dark4,
  backgroundPress: tokens.color.dark5,
  backgroundFocus: tokens.color.dark4,
  backgroundStrong: tokens.color.dark3,
  backgroundTransparent: 'rgba(0,0,0,0)',
  backgroundSubtle: tokens.color.dark2,

  color: tokens.color.dark12,
  colorHover: tokens.color.dark12,
  colorPress: tokens.color.dark11,
  colorFocus: tokens.color.dark12,
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: tokens.color.dark6,
  borderColorHover: tokens.color.dark8,
  borderColorFocus: tokens.color.primaryDark7,
  borderColorPress: tokens.color.primaryDark7,

  placeholderColor: tokens.color.primaryDark11,
  outlineColor: tokens.color.primaryDark7,

  // Semantic colors
  primary: tokens.color.primaryDark9,
  primaryHover: tokens.color.primaryDark10,
  muted: tokens.color.dark3,
  mutedForeground: tokens.color.dark11,
  accent: tokens.color.accentDark9,
  accentHover: tokens.color.accentDark10,
  accentForeground: tokens.color.accentDark12,

  // Shadows
  shadowColor: tokens.shadow.dark1,
  shadowColorHover: tokens.shadow.dark2,
  shadowColorPress: tokens.shadow.dark1,
  shadowColorFocus: tokens.shadow.dark2,
};

export const themes = {
  light,
  dark,
} as const;

export type ThemeName = keyof typeof themes;
