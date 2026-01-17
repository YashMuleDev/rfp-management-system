# Smart Proposal Management System

[![CI](https://github.com/YOUR_USERNAME/rfp-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/rfp-management-system/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/rfp-management-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered system for managing business proposals and vendor requests. Built with Next.js and Google Gemini AI to help organizations streamline their procurement process.

## 🤔 What is an RFP?

**RFP stands for "Request for Proposal"** - it's a business document that organizations use when they want to buy products or services. Think of it like posting a job listing, but for companies instead of employees.

**Here's how it works:**
1. **Company needs something** (like a new website, catering service, or software)
2. **Creates an RFP** describing what they need and their requirements
3. **Sends it to vendors** (companies that provide those services)
4. **Vendors submit proposals** with their solutions and pricing
5. **Company compares proposals** and chooses the best one

**This system makes that entire process easier and smarter with AI assistance!**

## ✨ Features

- 📧 **Email Integration** - Manage requests and responses through email
- 🤖 **AI-Powered Comparison** - Let AI analyze and compare vendor proposals automatically
- 👥 **Vendor Management** - Keep track of all your service providers and suppliers
- 📊 **Proposal Tracking** - Monitor all submitted proposals and their status
- 🎯 **Smart Recommendations** - Get AI insights to help choose the best proposal
- 📱 **Easy to Use** - Clean, modern interface that works on any device
- � **Business Ready** - Professional tools for procurement teams

## 🏢 Who Can Use This?

- **Small Businesses** - Finding contractors, suppliers, or service providers
- **Procurement Teams** - Managing vendor selection processes
- **Project Managers** - Comparing bids for projects
- **Startups** - Choosing between different service options
- **Anyone** - Who needs to compare multiple business proposals

## 💡 Real-World Examples

**Need a new website?** Create an RFP describing your requirements, send it to web developers, compare their proposals with AI assistance, and choose the best one.

**Planning an event?** Send RFPs to caterers, venues, and photographers. Let the AI help you compare prices, services, and reviews to make the best decision.

**Buying office supplies?** Get proposals from different suppliers and use AI to find the best value for money.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rfp-management-system.git
   cd rfp-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **UI:** Tailwind CSS + Radix UI
- **AI:** Google Gemini API
- **Forms:** React Hook Form + Zod validation

## 📁 Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── inbox/          # Email management
│   ├── rfps/           # RFP pages
│   ├── compare/        # Proposal comparison
│   └── vendors/        # Vendor management
├── components/         # React components
├── lib/               # Utilities and configs
├── prisma/            # Database schema
└── public/            # Static assets
```

## � Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/rfp-management-system)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
4. Deploy

### Other Platforms

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides for:
- Netlify
- Railway
- Docker
- Self-hosted options

## � Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Yes |

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.