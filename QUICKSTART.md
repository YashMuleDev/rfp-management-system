# Quick Start Guide

Get up and running with the RFP Management System in 5 minutes.

## Prerequisites

- Node.js 18 or higher
- npm or pnpm
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
.\scripts\setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key_here
   ```

3. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create a Vendor:**
   - Go to Vendors page
   - Click "Add Vendor"
   - Fill in vendor details

2. **Create an RFP:**
   - Go to RFPs page
   - Click "Create RFP"
   - Fill in RFP details or paste text to extract

3. **Submit Proposals:**
   - Vendors can submit proposals for RFPs
   - View and compare proposals

4. **Compare Proposals:**
   - Use AI-powered comparison
   - Get insights and recommendations

## Troubleshooting

**Port already in use:**
```bash
# The app will automatically use the next available port
# Or kill the process using port 3000
```

**Database errors:**
```bash
# Reset the database
rm dev.db
npx prisma db push
```

**API key issues:**
- Verify your key is correct in `.env`
- Check you have API quota remaining
- Ensure the key has Gemini API access

## Next Steps

- Read the full [README.md](README.md)
- Check out [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation
