# Étoile

A premium ballet & dance tracking app built with Expo React Native + TypeScript.

## Project Structure

```
etoile/
├── app/
│   ├── _layout.tsx          # Root layout (Expo Router)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator layout
│       ├── index.tsx        # Classes screen
│       └── practice.tsx     # Practice screen
├── components/
│   ├── icons/               # SVG icon components
│   ├── ActivityCard.tsx     # Monthly / weekly activity bar-chart card
│   ├── BarChart.tsx         # Reusable animated bar chart
│   ├── Card.tsx             # Base card container
│   ├── CardHeader.tsx       # Shared card header row
│   ├── NextClassCard.tsx    # Upcoming class card
│   ├── ProgressBar.tsx      # Goal progress bar
│   ├── ScreenHeader.tsx     # Hero image + title header
│   ├── StudiosAttendedCard.tsx
│   ├── TabBar.tsx           # Custom bottom tab bar + FAB
│   └── YearlyGoalCard.tsx
├── constants/
│   ├── Colors.ts            # Brand palette
│   ├── MockData.ts          # Local mock data
│   └── Typography.ts        # Text style tokens
└── types/
    └── index.ts             # Shared TypeScript interfaces
```

## Running Locally (Mac + Expo Go)

### Prerequisites

- Node.js 18+ (you have 22) — ✅
- [Expo Go](https://apps.apple.com/app/expo-go/id982107779) installed on your iPhone or iPad

### Steps

1. **Install dependencies** (already done if you cloned fresh):
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npx expo start
   ```

3. **Open in Expo Go:**
   - A **QR code** appears in your terminal.
   - Open the **Camera** app on your iPhone, point it at the QR code.
   - Tap the banner to open in **Expo Go**.
   - The app will load and hot-reload as you make changes.

4. **Or run in iOS Simulator** (requires Xcode):
   ```bash
   npx expo start --ios
   ```
   Press `i` in the terminal after the server starts to launch the simulator.

### Useful Commands

| Command | Description |
|---|---|
| `npx expo start` | Start the dev server |
| `npx expo start --ios` | Open in iOS Simulator |
| `npx expo start --android` | Open in Android Emulator |
| `npx expo start --web` | Open in browser (limited) |

## Tech Stack

- **Expo SDK 54** with Expo Router (file-based routing)
- **React Native 0.81** + **TypeScript 5.9**
- **react-native-svg** for crisp vector icons
- **expo-linear-gradient** & **expo-blur** (available for future use)
- Local mock data — ready to swap for a real API
