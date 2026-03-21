# Dojo - Daily Mental Calibration App

A mindfulness and mental training app built with React Native (Expo). Dark-themed, offline-first, no accounts, no tracking, no ads, no cloud.

**License:** MIT

## Core Features

### 1. Daily Dashboard (Home Tab)
- **Morning Dojo** (adjustable, default 60 min): Breathing exercise + Mindfulness
- **Midday Reset** (adjustable, default 10 min): Yoga reset + Post-lunch mindfulness
- **Evening Mastery** (adjustable, default 20 min): Tai Chi + Kata + Breathing cool-down
- Streak counter with flame badge
- Daily mantra display
- **Simple Mode**: Quick Start guides per block, simplified text

### 2. Journal Tab
- One-tap ERN logging with rotating reflection prompts
- Entries grouped by date; long-press to delete
- Export journal via share sheet

### 3. Library Tab (Offline Reader)
- ACC Paper: Neuroscience of error detection and mental calibration
- V3.0 Ledger: Complete daily protocol overview
- PTSD & Population Mapping: Applications for veterans, inmates, and space
- Daily Mantra: Guiding principle and explanation
- How + Why Manual: Practical guide to the Dojo method
- **Glossary**: Plain-English definitions for ACC, ERN, SERP, HOS, R_ACC, Archimedes Point, N-Version Programming, Byzantine Fault Tolerance, and "the struggle itself is the meaning"

### 4. Settings Tab (gear icon)
- **Simple Mode toggle**: Beginner-friendly view with Quick Start guides and shorter text
- **Text Size selector**: Small / Medium / Large — persisted locally
- **Timer Duration controls**: +/− buttons to adjust each block's duration (Morning 5–180 min, Midday 2–60 min, Evening 5–120 min) — persisted locally
- Streak tracking (current + longest)
- Stats: journal entries count, blocks completed
- Export journal data / Reset all data

## Tech Stack
- **Frontend:** Expo SDK 53, React Native, TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **State:** Zustand with AsyncStorage persistence
- **Animations:** React Native Reanimated
- **Icons:** Lucide React Native
- **Storage:** All data local via AsyncStorage — 100% offline

## Mantra
> "I accept what is. I calibrate what arises. The struggle itself is the meaning."
