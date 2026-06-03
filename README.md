# MediGuard AI — AI Rural Health Intelligence Platform

> "Bridging the Gap Between First Symptom & First Diagnosis"

MediGuard AI is a production-ready, PWA-enabled web application that brings AI-powered healthcare screening to underserved rural communities. Available in 5 Indian languages.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT with httpOnly cookies + bcrypt
- **AI**: Google Gemini API (`gemini-1.5-pro`) with rule-based fallback
- **PWA**: vite-plugin-pwa (offline-capable, installable)
- **Charts**: Recharts
- **State**: Zustand
- **i18n**: react-i18next (EN, HI, TA, TE, BN)
- **Env Validation**: Zod (fail-fast startup checks)
- **CI**: GitHub Actions (Node 18 + 20)

## Features

- **AI Symptom Checker**: Conversational UI with voice input, powered by Gemini API
- **Disease Screening**: Evidence-based modules for Diabetes, Hypertension, TB, Anemia, Maternal Health
- **Health Records**: Timeline view, vital tracking charts, QR health card, PDF export
- **Telemedicine**: Doctor directory, chat, video call placeholder, appointment booking
- **Health Education**: Multilingual articles and videos with bookmarks
- **Community**: Health camps info, government schemes, outbreak reporting
- **Worker Portal**: Patient management, analytics dashboard, bulk data entry
- **Admin Panel**: User management, content management, system health monitoring
- **Dark Mode**: Hybrid class + data-attribute theme toggle with localStorage persistence

## Getting Started

```bash
# Clone the repository
git clone https://github.com/haribalaji7/mediguard-ai.git
cd mediguard-ai

# Install all dependencies (root + client + server)
npm run install:all

# Copy environment template and configure
cp server/.env.example server/.env
# Edit server/.env — at minimum set JWT_SECRET (≥ 8 chars)

# Run both client and server in development mode
npm run dev
```

Client runs at `http://localhost:5173`, Server at `http://localhost:5000`.

> **Note**: The app runs with full mock data even without `MONGODB_URI` or `GEMINI_API_KEY`.
> The only **required** variable is `JWT_SECRET`.

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | **Yes** | JWT signing secret (min 8 chars) |
| `MONGODB_URI` | No | MongoDB Atlas connection string (mock data if omitted) |
| `GEMINI_API_KEY` | No | Google Gemini API key (fallback analysis if omitted) |
| `JWT_REFRESH_SECRET` | No | Refresh token secret |
| `CLIENT_URL` | No | Frontend URL (default: `http://localhost:5173`) |
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` / `production` / `test` |

Environment variables are validated at startup using **Zod**. The server will refuse to start with a clear error message if any required variable is missing or invalid.

## Project Structure

```
mediguard-ai/
├── .github/workflows/     # CI pipeline (lint + build)
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI, Layout, Feature components
│   │   ├── pages/         # 11 pages (Landing, Auth, Dashboard, etc.)
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client, i18n, utils, mock data
│   │   └── types/         # TypeScript interfaces
│   └── public/            # Static assets, PWA icons
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API route definitions
│   │   ├── models/        # Mongoose schemas
│   │   ├── middleware/     # Auth, error handler, rate limiter, CORS
│   │   ├── services/      # Gemini AI, PDF generation
│   │   └── config/        # Database, env validation (Zod)
│   └── .env.example
└── README.md
```

## Browser Compatibility

- **Voice Input**: Uses the Web Speech API (`SpeechRecognition`). The microphone button is automatically hidden in browsers that do not support it (e.g., some Android WebViews, older iOS Safari).
- **PWA**: Installable on Chrome, Edge, and Samsung Internet. Safari has limited PWA support.

## License

MIT
