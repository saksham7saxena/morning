# Morning Inspiration

**Morning Inspiration** is a calm, minimal dashboard dedicated to starting your day right with inspiration, structure, and focus.

## Overview

Designed with a premium feel and zero distractions, this personal dashboard includes:
*   **Static Weather Placeholder:** A simple display to set mindfully or dynamically hook up later.
*   **Daily Quotes:** Curated inspiration from historical figures.
*   **Morning Nudges:** Quick tips to center your focus.
*   **Today's Top 5 (To-Do):** A focused task list restricted to 5 essential items, resetting daily.
*   **Morning Briefing:** Top news headlines for a quick scan without the doomscroll.
*   **Dark Mode:** A built-in dark mode toggle that respects system preferences and remembers your choice.

## Architecture

The application is built deliberately with **zero external dependencies**:
- **Design:** Pure CSS Grid and Flexbox for a responsive, mobile-first layout.
- **Logic:** Vanilla JavaScript organized into modular objects (`AppDashboard`, `TodoComponent`).
- **Storage:** Employs browser `localStorage` to securely save your 'Top 5' tasks across sessions.
- **Data:** Datasets for quotes, nudges, and news are maintained locally as JSON arrays within `script.js` to ensure the app works instantly and completely offline.

## Future Extensibility

*   **Weather API Integration:** Replace the static HTML weather placeholder with dynamic data by integrating a free API (e.g., OpenWeatherMap) directly in the `AppDashboard` component.
*   **Expand Local Datasets:** Add more quotes and news categories to the local arrays.
*   **PWA Support:** Add a `manifest.json` and service worker to allow users to install the dashboard locally.

## Setup

Simply open `index.html` in your web browser. No server or complex build tools required.

## Status

🚀 **Live & Local**: Ready to boost your mornings.
