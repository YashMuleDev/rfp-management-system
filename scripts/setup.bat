@echo off
echo Setting up RFP Management System...

REM Check if .env exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update .env with your actual API keys!
) else (
    echo .env file already exists
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate

REM Push database schema
echo Setting up database...
call npx prisma db push

echo Setup complete! Run 'npm run dev' to start the development server.
pause
