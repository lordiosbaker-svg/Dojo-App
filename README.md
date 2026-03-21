# Dojo - Daily Mental Calibration App

A mindfulness and mental training app built with React Native (Expo). Dark-themed, offline-first, no accounts, no tracking, no ads, no cloud.

**License:** MIT

## Core Features

### 1. Daily Dashboard (Home Tab)
- **Morning Dojo** (adjustable, default 60 min): Breathing exercise + Mindfulness
- **Midday Reset** (adjustable, default 10 min): Yoga reset + Post-lunch mindfulness
- **Evening Mastery** (adjustable, default 20 min): Tai Chi + Kata + Breathing cool-down
- Streak counter with flame badge
- Daily mantra display (translated per language)
- **Simple Mode**: Quick Start guides per block, simplified text

### 2. Journal Tab
- One-tap ERN logging with rotating reflection prompts (translated)
- **Keyboard input**: Fully editable text field, auto-focuses on tab open
- **Speech-to-text**: Mic button activates native Web Speech API; dictation appends to typed text; offline
- Entries saved instantly to local storage with timestamp; displayed most recent first
- Long-press to delete; export via share sheet
- Prompts and UI fully translated per language

### 3. Library Tab (Offline Reader)
- ACC Paper: Neuroscience of error detection and mental calibration
- V3.0 Ledger: Complete daily protocol overview
- PTSD & Population Mapping: Applications for veterans, inmates, and space
- Daily Mantra: Guiding principle and explanation
- How + Why Manual: Practical guide to the Dojo method
- **Glossary**: Plain-English definitions for ACC, ERN, SERP, HOS, R_ACC, Archimedes Point, N-Version Programming, Byzantine Fault Tolerance, and "the struggle itself is the meaning" — fully translated per language

### 4. Settings Tab (gear icon)
- **Language selector**: English, Español, Français, Deutsch, Português, العربية — auto-detected from device locale, persisted locally; all app text updates instantly
- **Simple Mode toggle**: Beginner-friendly view with Quick Start guides and shorter text
- **Text Size selector**: Small / Medium / Large — persisted locally
- **Timer Duration controls**: +/− buttons to adjust each block's duration (Morning 5–180 min, Midday 2–60 min, Evening 5–120 min) — persisted locally
- Streak tracking (current + longest)
- Stats: journal entries count, blocks completed
- Export journal data / Reset all data

## Multi-Language Support
All UI text is translated: block names, phase instructions, journal prompts, glossary terms, mantra, and settings labels.

| Code | Language   |
|------|------------|
| en   | English    |
| es   | Español    |
| fr   | Français   |
| de   | Deutsch    |
| pt   | Português  |
| ar   | العربية    |

Language is auto-detected from `navigator.language` on first launch and can be changed in Settings.

## Tech Stack
- **Frontend:** Expo SDK 53, React Native, TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **State:** Zustand with AsyncStorage persistence
- **Animations:** React Native Reanimated
- **Icons:** Lucide React Native
- **i18n:** Custom `useTranslation()` hook with flat typed translation files (no external library)
- **Speech:** Web Speech API (`SpeechRecognition`) — offline, web/PWA only
- **Storage:** All data local via AsyncStorage — 100% offline

## Mantra
> "I accept what is. I calibrate what arises. The struggle itself is the meaning."
