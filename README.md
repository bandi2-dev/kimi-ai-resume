# Orbit

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/tRPC-11-2596BE?logo=trpc" alt="tRPC" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google" alt="Google Gemini" />
</p>

**Orbit** is an AI-powered resume optimization platform that helps job seekers craft resumes that pass ATS filters, impress recruiters, and land interviews. Built with React 19, TypeScript, tRPC, Drizzle ORM, and Google's Gemini AI.

## Features

- **ATS Score Analysis** - Comprehensive evaluation across 5 dimensions: ATS compatibility, keyword density, impact statements, readability, and formatting
- **AI Resume Optimization** - Gemini-powered rewrite engine that transforms passive language into powerful, quantified achievements
- **Job Match Analysis** - Compare your resume against any job description and get a tailored version optimized for that role
- **4 Professional Templates** - Modern, Classic, Technical, and Creative layouts with live preview
- **Split Editor** - Real-time markdown editor with synced A4 paper preview
- **Dark Mode** - Beautiful dark theme with gold and teal accents
- **Auth & History** - OAuth 2.0 login with saved analysis history

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Three.js, Recharts |
| Backend | Hono, tRPC 11, Drizzle ORM, MySQL |
| AI | Google Gemini 2.5 Pro |
| Auth | OAuth 2.0 (Kimi) |
| DevOps | Docker, Docker Compose, Kubernetes, GitHub Actions |

## Quick Start

### Prerequisites

- Node.js 22+
- MySQL database
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/orbit.git
cd orbit

# Install dependencies
npm install

# Set up environment variables
# The .env file is auto-generated with Kimi OAuth credentials
# Add your Gemini API key:
# GEMINI_API_KEY=your_gemini_api_key_here

# Push database schema
npm run db:push

# Seed default templates
npx tsx db/seed.ts

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `DATABASE_URL` | MySQL connection string | Yes (auto-generated) |
| `VITE_APP_ID` | Kimi OAuth app ID | Yes (auto-generated) |
| `APP_SECRET` | Kimi OAuth app secret | Yes (auto-generated) |
| `VITE_KIMI_AUTH_URL` | Kimi auth endpoint | Yes (auto-generated) |

## Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t orbit-resume .
docker run -p 3000:3000 --env-file .env orbit-resume
```

## Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Create secrets
kubectl create secret generic orbit-secrets \
  --from-literal=GEMINI_API_KEY=your_key \
  --from-literal=DATABASE_URL=your_db_url
```

## Project Structure

```
.
├── api/                    # Backend API
│   ├── lib/               # Utilities (Gemini client, env, cookies)
│   ├── queries/           # Database queries
│   ├── routers/           # tRPC routers
│   ├── kimi/              # OAuth SDK
│   ├── router.ts          # Main tRPC router
│   └── boot.ts            # Hono server entry
├── contracts/             # Shared types (frontend + backend)
├── db/                    # Database schema and migrations
│   ├── schema.ts
│   └── seed.ts
├── src/
│   ├── components/        # UI components
│   ├── hooks/             # React hooks
│   ├── pages/             # Route pages
│   ├── providers/         # Context providers
│   ├── sections/          # Landing page sections
│   ├── App.tsx
│   └── main.tsx
├── k8s/                   # Kubernetes manifests
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `resume.analyze` | Mutation | Analyze resume text with AI |
| `resume.optimize` | Mutation | Optimize resume with AI rewrite |
| `resume.jobMatch` | Mutation | Match resume against job description |
| `resume.getAnalysis` | Query | Get analysis by ID |
| `resume.listAnalyses` | Query | List user's analyses (auth required) |
| `template.list` | Query | List available templates |
| `auth.me` | Query | Get current user |
| `auth.logout` | Mutation | Clear session |

## Development

```bash
# Type check
npm run check

# Build for production
npm run build

# Start production server
npm start

# Format code
npm run format

# Run tests
npm run test

# Database operations
npm run db:push      # Sync schema
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
```

## License

MIT
