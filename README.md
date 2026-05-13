# Étoile

A premium ballet & dance practice tracker for iOS and Android, built with
**Expo**, **React Native** and **TypeScript**.

The current build implements the editorial "Classes" home screen from the
design reference: a hero header, a yearly-goal card with progress, the next
class, monthly activity, and a stacked breakdown of studios attended. A
second `Practice` tab tracks practice hours.

All data is mocked locally in `src/data/mock.ts` so the UI runs without any
backend.

## Project layout

```
app/                          Expo Router routes
├── _layout.tsx               Root stack + font loading + safe areas
└── (tabs)/
    ├── _layout.tsx           Custom bottom tab bar
    ├── index.tsx             Classes (Home) screen
    └── practice.tsx          Practice screen

src/
├── components/               Reusable UI primitives (Card, ProgressBar, …)
│   └── cards/                Composed dashboard cards
├── data/                     Local mock data
├── theme/                    Colors, spacing, typography, shadows
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
   npm install
   ```

2. **Start the Metro dev server**

   ```bash
   npx expo start
   ```

   This opens the Expo CLI in your terminal and a developer page in the
   browser, with a QR code.

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

## Notes on the design

- **Fonts**: editorial titles use *Playfair Display* (Bold) and the rest
  of the UI uses *Inter*. Both are loaded asynchronously through
  `@expo-google-fonts/*` so the bundle stays small.
- **Color**: a single saturated red (`#FF3B12`) is used as the only
  accent against neutral surfaces, in line with the reference.
- **Layout**: cards sit on a soft gray canvas with subtle shadows; the
  bottom tab bar is a compact pill paired with a floating "+" button.
- **No backend yet**: every metric on screen comes from
  `src/data/mock.ts`, so it is safe to tweak values and immediately see
  the effect.
