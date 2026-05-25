export type OnboardingSlide =
  | {
      id: string;
      kind: 'brand';
      title: string;
      subtitle: string;
    }
  | {
      id: string;
      kind: 'body';
      text: string;
    };

/** Ordered 01 → 07 per asset filenames. */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '01',
    kind: 'brand',
    title: 'Étoile',
    subtitle: 'Practice with intention',
  },
  {
    id: '02',
    kind: 'body',
    text: "Hi, I'm Yihui.\nDesigner & dancer.",
  },
  {
    id: '03',
    kind: 'body',
    text: 'After years of ballet training, I learned that behind every effortless performance are countless hours of intentional practice.',
  },
  {
    id: '04',
    kind: 'body',
    text: 'So I built Étoile.',
  },
  {
    id: '05',
    kind: 'body',
    text: 'A simple space to track classes, document progress, and stay motivated through the highs and lows of training.',
  },
  {
    id: '06',
    kind: 'body',
    text: 'A quiet companion for the journey. Étoile is built for dancers who care deeply about growth, consistency, and the beauty of showing up again and again.',
  },
  {
    id: '07',
    kind: 'body',
    text: 'Built by dancers,\nfor dancers.',
  },
];

/** Shown after story 07 — same typography as body stories. */
export const ONBOARDING_CTA_TOP_TEXT = 'Built by dancers,\nfor dancers.';
export const ONBOARDING_CTA_BOTTOM_TEXT = "Let's begin your\njourney.";

export const ONBOARDING_STORY_DURATION_MS = 5500;
