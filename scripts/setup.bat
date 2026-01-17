@echo off
echo Setting up RFP Management System...

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo WARNING: Please update .env with your Google Gemini API key!
) else (
    echo .env file already exists
)

REM Install dependencies
echo Installing dependencies...
call npm install

echo Setup complete! Run 'npm run dev' to start development.
pause
