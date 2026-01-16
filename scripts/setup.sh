#!/bin/bash

echo "🚀 Setting up RFP Management System..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual API keys!"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "🗄️  Setting up database..."
npx prisma db push

echo "✨ Setup complete! Run 'npm run dev' to start the development server."
