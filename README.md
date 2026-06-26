# 💪 Training Tracker

A mobile-first, offline-capable Progressive Web App (PWA) for tracking strength training workouts on iPhone.

## Features

✅ **Fully Offline** - Works without internet connection
✅ **PWA Support** - Install as standalone app on iPhone (Safari → Add to Home Screen)
✅ **Local Storage** - All data stored in IndexedDB (Dexie.js)
✅ **Responsive Design** - Optimized for mobile devices
✅ **Dark Mode** - Built-in theme support
✅ **Workout Tracking** - Log exercises, sets, reps, weight, RPE, and pain levels
✅ **Progress Analytics** - View estimated 1RM, volume, and progress charts
✅ **Backup/Restore** - Export and import your data as JSON
✅ **No Backend** - No server, no cloud sync, no login required

## Technology Stack

- **Framework**: Angular 18 (Standalone Components)
- **UI Library**: Angular Material
- **Database**: Dexie.js (IndexedDB wrapper)
- **Charts**: Chart.js / ng2-charts
- **Styling**: SCSS
- **PWA**: Service Worker support

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/karmaghedon/training-tracker.git
cd training-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# Development server opens at http://localhost:4200
