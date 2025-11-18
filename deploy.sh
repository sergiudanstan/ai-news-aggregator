#!/bin/bash

# AI News Aggregator - Quick Deployment Script

echo "🚀 AI News Aggregator Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - AI News Aggregator"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "Choose your deployment platform:"
echo "1) Vercel (Frontend) + Render (Backend) - FREE & RECOMMENDED"
echo "2) Railway (All-in-one) - EASIEST"
echo "3) Just create GitHub repo (manual deployment later)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📝 Vercel + Render Deployment Steps:"
        echo ""
        echo "BACKEND (Render.com):"
        echo "1. Go to https://render.com and sign up"
        echo "2. Click 'New +' → 'Web Service'"
        echo "3. Connect your GitHub repo"
        echo "4. Configure:"
        echo "   - Name: ai-news-api"
        echo "   - Environment: Python 3"
        echo "   - Build Command: pip install -r requirements.txt"
        echo "   - Start Command: gunicorn api_server:app"
        echo "5. Add environment variable: FLASK_ENV=production"
        echo "6. Click 'Create Web Service'"
        echo "7. Copy your backend URL (e.g., https://ai-news-api.onrender.com)"
        echo ""
        echo "FRONTEND (Vercel):"
        echo "1. Update web-dashboard/.env.production with your backend URL"
        read -p "   Enter your Render backend URL: " backend_url
        echo "VITE_API_URL=$backend_url" > web-dashboard/.env.production
        echo "2. Install Vercel CLI: npm install -g vercel"
        echo "3. Run: cd web-dashboard && vercel"
        echo "4. Follow the prompts"
        echo ""
        echo "✅ Configuration files ready!"
        ;;
    2)
        echo ""
        echo "📝 Railway Deployment Steps:"
        echo ""
        echo "1. Install Railway CLI: npm install -g @railway/cli"
        echo "2. Login: railway login"
        echo "3. Deploy backend: railway up"
        echo "4. Deploy frontend: cd web-dashboard && railway up"
        echo "5. Link services in Railway dashboard"
        echo ""
        ;;
    3)
        echo ""
        echo "📝 Creating GitHub repository..."
        echo ""
        echo "Run these commands:"
        echo "1. Create a new repo on GitHub.com"
        echo "2. git remote add origin YOUR_REPO_URL"
        echo "3. git push -u origin main"
        echo ""
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📚 Full deployment guide: See DEPLOYMENT.md"
echo "✨ Good luck with your deployment!"
