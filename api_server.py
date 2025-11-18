from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.scrapers.rss_scraper import RSSScraper

app = Flask(__name__)

# Configure CORS - allow all origins in development, specific origins in production
cors_origins = os.getenv('CORS_ORIGINS', '*')
if cors_origins != '*':
    cors_origins = cors_origins.split(',')
CORS(app, origins=cors_origins)

@app.route('/')
def home():
    """Root endpoint - shows API is running"""
    return jsonify({
        'status': 'online',
        'message': 'AI News Aggregator API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'fetch': '/api/fetch (POST)'
        }
    })

@app.route('/api/fetch', methods=['POST'])
def fetch_news():
    """Fetch news from provided RSS feeds"""
    data = request.json
    feeds = data.get('feeds', [])
    
    if not feeds:
        return jsonify({'error': 'No feeds provided'}), 400
    
    try:
        scraper = RSSScraper(feeds)
        articles = scraper.scrape()
        
        # Add source domain to each article
        for article in articles:
            if article.get('link'):
                try:
                    from urllib.parse import urlparse
                    domain = urlparse(article['link']).netloc.replace('www.', '')
                    article['source'] = domain
                except:
                    article['source'] = 'Unknown'
        
        return jsonify({
            'success': True,
            'articles': articles,
            'count': len(articles)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print("🚀 Starting AI News Aggregator API Server...")
    print(f"📡 Server running on http://localhost:{port}")
    print("🌐 Dashboard should connect to this server")
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') != 'production')
