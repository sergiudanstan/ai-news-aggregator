# Deploying AI News Aggregator Online

This guide covers multiple deployment options for your AI News Aggregator, from simple to production-ready.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED**

#### **Frontend (Vercel) - FREE**

1. **Build the frontend:**
   ```bash
   cd web-dashboard
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Choose `web-dashboard` as root directory
   - Vercel will auto-detect Vite

4. **Update API URL:**
   After deploying backend, update `src/main.ts`:
   ```typescript
   const API_URL = 'https://your-backend.onrender.com';
   // Replace http://localhost:8000 with your Render URL
   ```

#### **Backend (Render) - FREE**

1. **Create `requirements.txt`:**
   ```bash
   cd /Users/sara/ai-news-aggregator-dan
   uv pip compile pyproject.toml -o requirements.txt
   ```

2. **Create `render.yaml`:**
   ```yaml
   services:
     - type: web
       name: ai-news-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn api_server:app
       envVars:
         - key: PYTHON_VERSION
           value: 3.14
   ```

3. **Add gunicorn to dependencies:**
   Add to `pyproject.toml`:
   ```toml
   "gunicorn>=21.2.0",
   ```

4. **Push to GitHub and connect to Render.com**

---

### Option 2: Railway - **EASIEST** (All-in-One)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy Backend:**
   ```bash
   cd /Users/sara/ai-news-aggregator-dan
   railway init
   railway up
   ```

4. **Deploy Frontend:**
   ```bash
   cd web-dashboard
   railway init
   railway up
   ```

5. **Link services** in Railway dashboard

---

### Option 3: Docker + Any Cloud Provider

#### **Create Dockerfiles**

**Backend Dockerfile:**
```dockerfile
FROM python:3.14-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync

COPY . .

EXPOSE 8000

CMD ["uv", "run", "gunicorn", "-b", "0.0.0.0:8000", "api_server:app"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY web-dashboard/package*.json ./
RUN npm install

COPY web-dashboard/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

Deploy to:
- **DigitalOcean App Platform**
- **AWS ECS**
- **Google Cloud Run**
- **Azure Container Apps**

---

### Option 4: Netlify (Frontend) + PythonAnywhere (Backend)

#### **Frontend on Netlify:**

1. **Build:**
   ```bash
   cd web-dashboard
   npm run build
   ```

2. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

#### **Backend on PythonAnywhere:**

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com) (free tier)
2. Upload your code
3. Set up Flask app in Web tab
4. Configure WSGI file

---

## 🔧 Pre-Deployment Checklist

### 1. **Environment Variables**

Create `.env` file for backend:
```bash
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.com
```

### 2. **Update CORS Settings**

In `api_server.py`:
```python
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=os.getenv('CORS_ORIGINS', '*'))
```

### 3. **Update API URL in Frontend**

Create `web-dashboard/.env.production`:
```
VITE_API_URL=https://your-backend-url.com
```

Update `src/main.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use API_URL instead of hardcoded localhost
const response = await fetch(`${API_URL}/api/fetch`, {
  // ...
});
```

### 4. **Build for Production**

```bash
cd web-dashboard
npm run build
# Creates optimized build in dist/
```

---

## 💰 Cost Comparison

| Platform | Frontend | Backend | Total/Month |
|----------|----------|---------|-------------|
| **Vercel + Render** | Free | Free | $0 |
| **Railway** | Free | Free* | $0-5 |
| **Netlify + PythonAnywhere** | Free | Free | $0 |
| **DigitalOcean** | $5 | $5 | $10 |
| **AWS/GCP/Azure** | ~$5 | ~$10 | $15+ |

*Railway free tier: 500 hours/month

---

## 🎯 Recommended Setup (Free)

**For your use case, I recommend:**

1. **Frontend**: Vercel (automatic HTTPS, CDN, instant deploys)
2. **Backend**: Render (free tier, auto-sleep when idle)

**Pros:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Auto-deploy on push
- ✅ Good performance

**Cons:**
- ⚠️ Backend sleeps after 15min inactivity (wakes in ~30s)
- ⚠️ Limited to 750 hours/month on Render

---

## 📝 Step-by-Step: Vercel + Render

I can create the necessary configuration files and guide you through the deployment. Would you like me to:

1. Create all deployment configuration files?
2. Set up environment variables?
3. Create a GitHub Actions workflow for auto-deployment?

Let me know and I'll set it up for you!
