# RFP Management System

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Next.js application for managing Requests for Proposals (RFPs), vendors, and proposals with AI-powered features.

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

## Features

- 📧 Email integration for RFP management
- 🤖 AI-powered proposal comparison using Google Gemini
- 📊 Vendor management
- 📝 RFP creation and tracking
- 💼 Proposal submission and review

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Database:** SQLite with Prisma ORM
- **UI:** React 19, Tailwind CSS, Radix UI
- **AI:** Google Gemini API
- **Forms:** React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses Prisma with SQLite. Main models include:
- RFP (Request for Proposal)
- Vendor
- Proposal
- Email

To view and manage your database:
```bash
npx prisma studio
```

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── inbox/           # Email inbox page
│   ├── rfps/            # RFP management pages
│   ├── compare/         # Proposal comparison page
│   └── vendors/         # Vendor management pages
├── components/          # React components
│   ├── ui/             # UI components (Radix UI)
│   └── layout/         # Layout components
├── lib/                # Utility functions and configs
├── prisma/             # Database schema
└── public/             # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database file path | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

Note: For production, consider using PostgreSQL instead of SQLite.

### Other Platforms

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.
