# AI News Aggregator Dashboard

A beautiful, real-time web dashboard for aggregating and viewing AI and technology news from RSS feeds.

## Features

- ✨ **Modern UI**: Premium dark theme with smooth animations
- 📡 **RSS Feed Management**: Add/remove multiple RSS feeds
- 🚀 **Real-time Updates**: Fetch latest articles on demand
- 📊 **Statistics**: Track total articles, active feeds, and last update time
- 🎨 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast**: Built with Vite for lightning-fast development

## Getting Started

### 1. Install Python Dependencies

From the project root:
```bash
uv sync
```

### 2. Install Dashboard Dependencies

```bash
cd web-dashboard
npm install
```

### 3. Start the API Server

In one terminal (from project root):
```bash
uv run python api_server.py
```

The API will run on `http://localhost:8000`

### 4. Start the Dashboard

In another terminal (from web-dashboard directory):
```bash
npm run dev
```

The dashboard will run on `http://localhost:5173` (or next available port)

## Usage

1. **Add Feeds**: Enter RSS feed URLs and click "Add Feed"
2. **Fetch News**: Click "Fetch News" to get latest articles from all feeds
3. **View Articles**: Browse articles with source, timestamp, and summary
4. **Clear**: Remove all articles with the "Clear All" button

## Default Feeds

- BBC Technology: `http://feeds.bbci.co.uk/news/technology/rss.xml`
- TechCrunch: `https://techcrunch.com/feed/`

## Tech Stack

### Frontend
- TypeScript
- Vite
- Vanilla CSS (no frameworks!)

### Backend
- Python 3.14
- Flask
- feedparser
- flask-cors

## API Endpoints

- `POST /api/fetch` - Fetch articles from RSS feeds
- `GET /api/health` - Health check

## Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│   Dashboard     │ ──────> │  Flask API   │ ──────> │  RSS Feeds  │
│  (Frontend)     │  HTTP   │  (Backend)   │  Parse  │   (Web)     │
└─────────────────┘         └──────────────┘         └─────────────┘
```

## Development

- Frontend hot-reload: Vite automatically reloads on changes
- Backend debug mode: Flask runs in debug mode for auto-reload
