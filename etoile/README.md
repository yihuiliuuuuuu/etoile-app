# Étoile — Ballet & Dance Tracker

A premium dance class and practice tracking app built with Expo, React Native, and TypeScript.

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+
- **Expo Go** app on your iPhone or Android phone
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Setup

```bash
cd etoile
npm install
```

## Running Locally on macOS

Start the Expo dev server:

```bash
npx expo start
```

This opens an interactive terminal. From there you can:

- **Scan the QR code** with your phone's camera (iOS) or the Expo Go app (Android) to preview on a real device
- Press **`i`** to open in the iOS Simulator (requires Xcode installed)
- Press **`w`** to open in a web browser

### Tunnel Mode (if QR code doesn't connect)

If your phone and Mac are on different networks, use tunnel mode:

```bash
npx expo start --tunnel
```

This requires `@expo/ngrok` — it will prompt you to install it automatically.

## Project Structure

```
etoile/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout
│   └── (tabs)/               # Tab navigation
│       ├── _layout.tsx       # Tab bar + FAB
│       ├── index.tsx         # Classes screen
│       └── practice.tsx      # Practice screen
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── MiniBarChart.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── YearlyGoalCard.tsx
│   │   ├── NextClassCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── StudiosCard.tsx
│   │   ├── ProfileAvatar.tsx
│   │   ├── HeaderBanner.tsx
│   │   └── index.ts
│   ├── constants/
│   │   └── theme.ts          # Colors, spacing, typography
│   ├── data/
│   │   └── mockData.ts       # Local mock data
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── assets/                   # App icons, splash screen
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Expo SDK 54** — managed workflow
- **Expo Router** — file-based routing
- **TypeScript** — strict mode
- **React Native** 0.81
- **expo-linear-gradient** — header gradient overlays
- **react-native-safe-area-context** — safe area handling
