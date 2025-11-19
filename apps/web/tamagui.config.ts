import { config } from '@craftedtales/ui';
import type { CraftedTalesUIConfig } from '@craftedtales/ui';

declare module 'tamagui' {
  interface TamaguiCustomConfig extends CraftedTalesUIConfig {}
}

export default config;
