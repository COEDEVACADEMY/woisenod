import { config } from '@tamagui/config/v3';
import { createTamagui, createTokens } from 'tamagui';

const tamaguiConfig = createTamagui({
  ...config,
  shorthands: {
    ...config.shorthands,
  },
  media: {
    ...config.media,
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
