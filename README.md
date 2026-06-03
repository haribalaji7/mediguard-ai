# AAROGYAM — AI Rural Health Intelligence Platform

> "Bridging the Gap Between First Symptom & First Diagnosis"

AAROGYAM is a production-ready, PWA-enabled web application that brings AI-powered healthcare screening to underserved rural communities. Available in 5 Indian languages.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT with httpOnly cookies + bcrypt
- **AI**: Google Gemini API (gemini-pro)
- **PWA**: vite-plugin-pwa (offline-capable, installable)
- **Charts**: Recharts
- **State**: Zustand
- **i18n**: react-i18next (EN, HI, TA, TE, BN)

## Features

- **AI Symptom Checker**: Conversational UI with voice input, powered by Gemini API
- **Disease Screening**: Evidence-based modules for Diabetes, Hypertension, TB, Anemia, Maternal Health
- **Health Records**: Timeline view, vital tracking charts, QR health card, PDF export
- **Telemedicine**: Doctor directory, chat, video call placeholder, appointment booking
- **Health Education**: Multilingual articles and videos with bookmarks
- **Community**: Health camps info, government schemes, outbreak reporting
- **Worker Portal**: Patient management, analytics dashboard, bulk data entry
- **Admin Panel**: User management, content management, system health monitoring

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Run both client and server in development mode
npm run dev
```

Client runs at `http://localhost:5173`, Server at `http://localhost:5000`.

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: 5000) |

The app runs with full mock data even without MongoDB or Gemini API keys.

## Project Structure

```
aarogyam/
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
│   │   ├── middleware/     # Auth, error handler, rate limiter
│   │   ├── services/      # Gemini AI, PDF generation
│   │   └── config/        # Database connection
│   └── .env.example
└── README.md
```

## License

MIT
