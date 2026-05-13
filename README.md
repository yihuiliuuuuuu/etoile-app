# Étoile

A premium ballet & dance practice tracker for iOS and Android, built with
**Expo**, **React Native** and **TypeScript**.

The aesthetic is soft and editorial: warm ivory canvas, dusty-rose
accents, gold highlights, Playfair Display serif headlines paired with
Manrope sans for UI. Designed to feel calm and personal rather than
gamified.

## Screens

- **Home** — italic-serif greeting + avatar, *Today's Practice* hero
  card with a gradient progress ring, *Weekly Progress* mini-chart with
  streak pill, and a three-up quick actions row (Log practice / Add
  note / View progress).
- **Log** — three-up list of capture options and a warm-up CTA.
- **Progress** — weekly ring, the weekly chart in full, and key stats
  (this month, best streak).
- **Profile** — avatar header, a saved quote in the soft card variant,
  and a settings list (daily goal, reminders, theme, support, sign out).

All data is mocked locally in `src/data/mock.ts` so the UI runs without
any backend.

## Project layout

```
app/                          Expo Router routes
├── _layout.tsx               Root stack + font loading + safe areas
└── (tabs)/
    ├── _layout.tsx           Bottom tabs: Home / Log / Progress / Profile
    ├── index.tsx             Home screen
    ├── log.tsx               Log entry options
    ├── progress.tsx          Weekly progress overview
    └── profile.tsx           Profile + settings

src/
├── components/
│   ├── AppText.tsx           Typed Text using the typography scale
│   ├── Avatar.tsx
│   ├── Card.tsx              surface / soft / primary variants
│   ├── Greeting.tsx          Italic serif salutation + name + avatar
│   ├── PracticeRing.tsx      Gradient SVG progress ring
│   ├── PrimaryButton.tsx     Pill button (solid / outline / ghost)
│   ├── QuickActions.tsx      Three-up action tile row
│   ├── ScreenContainer.tsx   Safe-area + scroll boilerplate
│   ├── SectionTitle.tsx
│   ├── TodaysPracticeCard.tsx
│   └── WeeklyProgress.tsx    7-day mini chart with streak pill
├── data/mock.ts              Local mock HomeSnapshot
├── theme/                    colors, spacing, radii, typography, shadows
└── types/                    Shared TypeScript models

assets/                       Icons and splash images
```

## Run it locally on macOS with Expo Go

> Requirements: macOS, Node.js 20+, and the **Expo Go** app installed on
> your iPhone or Android device (from the App Store / Play Store).

1. **Clone & install dependencies**

   ```bash
   git clone https://github.com/yihuiliuuuuuu/etoile-app.git
   cd etoile-app
   git checkout cursor/create-etoile-expo-app-f5aa
   npm install
   ```

2. **Start the Metro dev server**

   ```bash
   npx expo start
   ```

   This opens the Expo CLI in your terminal and a developer page in the
   browser with a QR code.

3. **Open the app in Expo Go**

   - **iPhone:** open the iOS **Camera** app, point it at the QR code in
     the terminal/browser, and tap the banner. Expo Go will launch the
     app.
   - **Android:** open **Expo Go**, tap *Scan QR code*, and scan the code.

   Your phone and Mac must be on the same Wi‑Fi network. If they are not,
   run `npx expo start --tunnel` to proxy through Expo's tunnel.

4. **Optional simulators** (no phone needed)

   - iOS Simulator (requires Xcode): press `i` in the Expo CLI, or run
     `npm run ios`.
   - Android Emulator (requires Android Studio): press `a`, or run
     `npm run android`.
   - Web preview: press `w`, or run `npm run web`.

## Scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run start`     | Start the Expo / Metro dev server             |
| `npm run ios`       | Start and open the iOS Simulator              |
| `npm run android`   | Start and open the Android Emulator           |
| `npm run web`       | Start the web preview                         |
| `npm run typecheck` | Run the TypeScript compiler in `--noEmit`     |
| `npm run lint`      | Run ESLint with the Expo ruleset              |

## Design notes

- **Fonts**: *Playfair Display* (medium / bold / italic) for editorial
  headlines and metrics; *Manrope* for UI and body. Both are loaded
  lazily through `@expo-google-fonts/*` + `expo-font` so first paint
  stays fast.
- **Color**: a single dusty-rose primary (`#B47882`) with soft blush
  fills, warm aubergine type, and a muted gold used sparingly (e.g. the
  ring gradient).
- **Shadows**: low-opacity, warm-tinted shadows lift cards gently off
  the ivory canvas without looking harsh.
- **No backend yet**: everything on screen reads from `src/data/mock.ts`.
  Swap that file with a real data source and the components keep working.
