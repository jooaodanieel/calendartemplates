# Calendar Templates

A Progressive Web App (PWA) that lets you create reusable event templates and sync them directly to Google Calendar.

The idea is simple: instead of manually creating multiple calendar events every time you have a recurring routine (e.g. travel + workout + shower + return), you define a template once and schedule it with a single action.

## Features

- **Event templates** — define an anchor event with optional blocks before and after it, each with its own label and duration
- **Smart scheduling** — pick a template, set a date and time, and preview all generated events before confirming
- **Google Calendar sync** — events are sent directly to your primary Google Calendar via the Calendar API
- **Offline-first** — templates are stored locally in IndexedDB and available without a connection
- **PWA installable** — works as a native-like app on Android and desktop
- **Template Hub** — export and import templates as JSON files to share between devices or users
- **Color support** — assign a Google Calendar color to each template

## Tech stack

- [Vue 3](https://vuejs.org/) with `<script setup>`
- [Vite 8](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Vue Router 5](https://router.vuejs.org/)
- [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- [Google Identity Services](https://developers.google.com/identity/oauth2/web) (OAuth 2.0 token model)
- [Google Calendar API v3](https://developers.google.com/calendar/api)

## Project structure

```
src/
├── components/        # Reusable UI components
│   ├── BlockCard.vue
│   ├── BlockList.vue
│   ├── Card.vue
│   ├── ColorPicker.vue
│   ├── EventPreviewCard.vue
│   ├── Navbar.vue
│   └── Snackbar.vue
├── integrations/      # External service adapters
│   ├── google_calendar.js
│   └── persistence.js
├── models/            # Business logic
│   ├── smart_event.js
│   └── template.js
├── pages/             # Route-level components
│   ├── SchedulerForm.vue
│   ├── TemplateForm.vue
│   └── TemplateHub.vue
├── router/
│   └── index.js
└── utils/
    ├── http_client.js
    ├── local_storage.js
    └── time_calculations.js
```

## Getting started

### Prerequisites

- Node.js
- A Google Cloud project with the **Google Calendar API** enabled and an **OAuth 2.0 Client ID** configured

### Google Cloud setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google Calendar API** under _APIs & Services → Library_
4. Go to _APIs & Services → Credentials_ and create an **OAuth 2.0 Client ID** (type: Web application)
5. Add your development URL (`http://localhost:5173`) and production URL to the authorised JavaScript origins
6. Copy the Client ID

### Installation

```bash
npm install
```

### Environment

Copy `.env.sample` to `.env` and fill in your Client ID:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint & format

```bash
npm run lint
npm run format
```

## Deployment

The app is a fully static build — deploy the `dist/` folder to any static hosting service. [Render](https://render.com) works well and provides HTTPS out of the box, which is required for the PWA install prompt and Google OAuth.

Remember to add your production URL to the authorised JavaScript origins in Google Cloud Console, and to set the `VITE_GOOGLE_CLIENT_ID` environment variable in your hosting provider's settings.

## Notes on authentication

This app uses the **Google Identity Services token model** (implicit flow). Access tokens expire after 60 minutes. The token is persisted in `localStorage` so the user stays logged in across page refreshes. When a token expires, the next Calendar API call will fail with a 401 and the user will be prompted to sign in again.

The app is currently in **test mode** on Google Cloud, meaning only users explicitly added as testers can sign in. To open it to the public, the OAuth consent screen must be published and verified by Google.

## License

MIT
