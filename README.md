# Étoile

A premium ballet & dance tracker built with Expo React Native and TypeScript.

## Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **Expo CLI** (installed automatically via `npx`)
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start
```

This will open the Expo dev tools in your terminal. From there:

- **iOS Simulator**: Press `i` to open in the iOS Simulator (requires Xcode)
- **Android Emulator**: Press `a` to open in an Android Emulator (requires Android Studio)
- **Expo Go on your phone**: Scan the QR code shown in the terminal
  - iPhone: scan with your Camera app
  - Android: scan with the Expo Go app

## Project Structure

```
├── App.tsx                  # App entry point (font loading, providers)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── MiniBarChart.tsx
│   │   ├── StudioBar.tsx
│   │   ├── ProfileAvatar.tsx
│   │   ├── HeroHeader.tsx
│   │   ├── YearlyGoalCard.tsx
│   │   ├── NextClassCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── StudiosCard.tsx
│   │   └── FloatingActionButton.tsx
│   ├── screens/             # Screen components
│   │   ├── ClassesScreen.tsx
│   │   └── PracticeScreen.tsx
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── TabBar.tsx
│   ├── data/                # Mock data
│   │   └── mockData.ts
│   ├── theme/               # Design tokens
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
├── app.json                 # Expo configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Tech Stack

- [Expo](https://expo.dev) SDK 54
- [React Native](https://reactnative.dev) 0.81
- [TypeScript](https://www.typescriptlang.org) 5.9
- [React Navigation](https://reactnavigation.org) 7
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Google Fonts)
