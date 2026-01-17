#!/bin/bash

echo "🚀 Setting up RFP Management System..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Google Gemini API key!"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✨ Setup complete! Run 'npm run dev' to start development."
