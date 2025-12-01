import { tokens } from './tokens';

const light = {
  background: tokens.color.light1,
  backgroundHover: tokens.color.light2,
  backgroundPress: tokens.color.light3,
  backgroundFocus: tokens.color.light2,
  backgroundStrong: tokens.color.light2,
  backgroundTransparent: 'rgba(0,0,0,0)',

  color: tokens.color.light12,
  colorHover: tokens.color.light12,
  colorPress: tokens.color.light11,
  colorFocus: tokens.color.light12,
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: tokens.color.light4,
  borderColorHover: tokens.color.light5,
  borderColorFocus: tokens.color.light6,
  borderColorPress: tokens.color.light5,

  placeholderColor: tokens.color.light8,
  outlineColor: tokens.color.light6,

  // Semantic colors
  muted: tokens.color.light5,
  mutedForeground: tokens.color.light10,
  accent: tokens.color.accentLight5,
  accentForeground: tokens.color.accentLight12,

  // Shadows
  shadowColor: tokens.shadow.light1,
  shadowColorHover: tokens.shadow.light2,
  shadowColorPress: tokens.shadow.light1,
  shadowColorFocus: tokens.shadow.light2,
};

type Theme = typeof light;

export const dark: Theme = {
  background: tokens.color.dark1,
  backgroundHover: tokens.color.dark2,
  backgroundPress: tokens.color.dark3,
  backgroundFocus: tokens.color.dark2,
  backgroundStrong: tokens.color.dark3,
  backgroundTransparent: 'rgba(0,0,0,0)',

  color: tokens.color.dark12,
  colorHover: tokens.color.dark12,
  colorPress: tokens.color.dark11,
  colorFocus: tokens.color.dark12,
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: tokens.color.dark3,
  borderColorHover: tokens.color.dark4,
  borderColorFocus: tokens.color.dark5,
  borderColorPress: tokens.color.dark4,

  placeholderColor: tokens.color.dark8,
  outlineColor: tokens.color.dark5,

  // Semantic colors
  muted: tokens.color.dark5,
  mutedForeground: tokens.color.dark10,
  accent: tokens.color.accentDark5,
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
};
