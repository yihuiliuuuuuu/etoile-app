import { Easing } from 'react-native-reanimated';

const EASE_OUT = Easing.out(Easing.cubic);

/** Sheet slides up with ease-out deceleration. */
export const SHEET_OPEN = {
  duration: 420,
  easing: EASE_OUT,
} as const;

/** Sheet slides down with ease-out. */
export const SHEET_CLOSE = {
  duration: 340,
  easing: EASE_OUT,
} as const;

/** Backdrop fades out with the sheet (same timing — no linger after dismiss). */
export const SHEET_BACKDROP_CLOSE = SHEET_CLOSE;
