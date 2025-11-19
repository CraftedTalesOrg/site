import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';
import * as Colors from '@tamagui/colors';

const darkPalette = ['hsla(220, 43%, 1%, 1)', 'hsla(220, 43%, 6%, 1)', 'hsla(220, 43%, 12%, 1)', 'hsla(220, 43%, 17%, 1)', 'hsla(220, 43%, 23%, 1)', 'hsla(220, 43%, 28%, 1)', 'hsla(220, 43%, 34%, 1)', 'hsla(220, 43%, 39%, 1)', 'hsla(220, 43%, 45%, 1)', 'hsla(220, 43%, 50%, 1)', 'hsla(0, 15%, 93%, 1)', 'hsla(0, 15%, 99%, 1)'];
const lightPalette = ['hsla(220, 43%, 93%, 1)', 'hsla(220, 43%, 88%, 1)', 'hsla(220, 43%, 84%, 1)', 'hsla(220, 43%, 79%, 1)', 'hsla(220, 43%, 74%, 1)', 'hsla(220, 43%, 69%, 1)', 'hsla(220, 43%, 64%, 1)', 'hsla(220, 43%, 60%, 1)', 'hsla(220, 43%, 55%, 1)', 'hsla(220, 43%, 50%, 1)', 'hsla(0, 15%, 15%, 1)', 'hsla(0, 15%, 1%, 1)'];

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
};

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
};

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(221, 38%, 51%, 1)', 'hsla(221, 38%, 52%, 1)', 'hsla(221, 38%, 53%, 1)', 'hsla(221, 38%, 54%, 1)', 'hsla(221, 38%, 55%, 1)', 'hsla(221, 38%, 56%, 1)', 'hsla(221, 38%, 57%, 1)', 'hsla(221, 38%, 58%, 1)', 'hsla(221, 38%, 59%, 1)', 'hsla(221, 38%, 60%, 1)', 'hsla(250, 50%, 90%, 1)', 'hsla(250, 50%, 95%, 1)'],
      light: ['hsla(221, 38%, 40%, 1)', 'hsla(221, 38%, 43%, 1)', 'hsla(221, 38%, 46%, 1)', 'hsla(221, 38%, 48%, 1)', 'hsla(221, 38%, 51%, 1)', 'hsla(221, 38%, 54%, 1)', 'hsla(221, 38%, 57%, 1)', 'hsla(221, 38%, 59%, 1)', 'hsla(221, 38%, 62%, 1)', 'hsla(221, 38%, 65%, 1)', 'hsla(250, 50%, 95%, 1)', 'hsla(250, 50%, 95%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },
});

export type Themes = typeof builtThemes;
export const themes: Themes = builtThemes;
