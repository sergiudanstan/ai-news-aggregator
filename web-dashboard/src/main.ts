import './style.css';

// Types
interface Article {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
}

// State
let feeds: string[] = [
  'http://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://techcrunch.com/feed/',
  'https://www.hotnews.ro/rss',
  'https://www.digi24.ro/rss',
  'https://www.mediafax.ro/rss'
];
let articles: Article[] = [];
let keywords: string[] = ['AI', 'ChatGPT', 'OpenAI', 'Machine Learning'];
let filteredArticles: Article[] = [];
let isFiltering: boolean = false;

// DOM Elements
const feedInput = document.getElementById('feedInput') as HTMLInputElement;
const addFeedBtn = document.getElementById('addFeedBtn') as HTMLButtonElement;
const fetchBtn = document.getElementById('fetchBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const feedList = document.getElementById('feedList') as HTMLElement;
const articlesGrid = document.getElementById('articlesGrid') as HTMLElement;
const totalArticlesEl = document.getElementById('totalArticles') as HTMLElement;
const activeFeedsEl = document.getElementById('activeFeeds') as HTMLElement;
const lastUpdatedEl = document.getElementById('lastUpdated') as HTMLElement;
const statusText = document.getElementById('statusText') as HTMLElement;

const keywordInput = document.getElementById('keywordInput') as HTMLInputElement;
const addKeywordBtn = document.getElementById('addKeywordBtn') as HTMLButtonElement;
const filterBtn = document.getElementById('filterBtn') as HTMLButtonElement;
const keywordList = document.getElementById('keywordList') as HTMLElement;

// Initialize
renderFeeds();
renderKeywords();
updateStats();

// Add feed
addFeedBtn.addEventListener('click', () => {
  const url = feedInput.value.trim();
  if (!url) {
    alert('Please enter a feed URL');
    return;
  }

  if (feeds.includes(url)) {
    alert('This feed is already added');
    return;
  }

  feeds.push(url);
  feedInput.value = '';
  renderFeeds();
  updateStats();
});

// Remove feed
function removeFeed(url: string) {
  feeds = feeds.filter(f => f !== url);
  renderFeeds();
  updateStats();
}

// Fetch news
fetchBtn.addEventListener('click', async () => {
  if (feeds.length === 0) {
    alert('Please add at least one feed');
    return;
  }

  setStatus('Fetching...', true);

  // Use environment variable for API URL, fallback to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${API_URL}/api/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feeds })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const data = await response.json();
    articles = data.articles || [];
    renderArticles();
    updateStats();
    setStatus('Ready', false);

    // Update last updated time
    lastUpdatedEl.textContent = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    setStatus('Error', false);
    alert('Failed to fetch news. Make sure the backend server is running on port 8000.');
  }
});

// Clear all articles
clearBtn.addEventListener('click', () => {
  if (articles.length === 0) return;

  if (confirm('Are you sure you want to clear all articles?')) {
    articles = [];
    renderArticles();
    updateStats();
    lastUpdatedEl.textContent = 'Never';
  }
});

// Render feeds
function renderFeeds() {
  if (feeds.length === 0) {
    feedList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">No feeds added yet</p>';
    return;
  }

  feedList.innerHTML = feeds.map(feed => {
    const domain = extractDomain(feed);
    return `
      <div class="feed-tag">
        <span>${domain}</span>
        <button onclick="window.removeFeed('${escapeHtml(feed)}')">×</button>
      </div>
    `;
  }).join('');
}

// Render articles
function renderArticles() {
  if (articles.length === 0) {
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3>No articles yet</h3>
        <p>Add RSS feeds and click "Fetch News" to get started</p>
      </div>
    `;
    return;
  }

  articlesGrid.innerHTML = articles.map(article => `
    <div class="article-card">
      <div class="article-meta">
        <span class="article-source">${escapeHtml(article.source || 'Unknown')}</span>
        <span>${formatDate(article.published)}</span>
      </div>
      <h3 class="article-title">${escapeHtml(article.title)}</h3>
      <p class="article-summary">${escapeHtml(article.summary || 'No summary available')}</p>
      <a href="${escapeHtml(article.link)}" target="_blank" class="article-link">
        Read More →
      </a>
    </div>
  `).join('');
}

// Update stats
function updateStats() {
  totalArticlesEl.textContent = articles.length.toString();
  activeFeedsEl.textContent = feeds.length.toString();
}

// Set status
function setStatus(text: string, loading: boolean) {
  statusText.textContent = text;
  if (loading) {
    fetchBtn.disabled = true;
    fetchBtn.style.opacity = '0.6';
  } else {
    fetchBtn.disabled = false;
    fetchBtn.style.opacity = '1';
  }
}

// Utility functions
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Unknown date';
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add keyword
addKeywordBtn.addEventListener('click', () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert('Please enter a keyword');
    return;
  }

  if (keywords.some(k => k.toLowerCase() === keyword.toLowerCase())) {
    alert('This keyword is already added');
    return;
  }

  keywords.push(keyword);
  keywordInput.value = '';
  renderKeywords();
});

// Remove keyword
function removeKeyword(keyword: string) {
  keywords = keywords.filter(k => k !== keyword);
  renderKeywords();
  // If filtering is active, re-filter
  if (isFiltering) {
    filterArticles();
  }
}

// Filter articles by keywords
filterBtn.addEventListener('click', () => {
  filterArticles();
});

function filterArticles() {
  if (keywords.length === 0) {
    alert('Please add at least one keyword to filter');
    return;
  }

  if (articles.length === 0) {
    alert('Please fetch articles first');
    return;
  }

  isFiltering = !isFiltering;

  if (isFiltering) {
    // Filter articles that contain any of the keywords
    filteredArticles = articles.filter(article => {
      const searchText = `${article.title} ${article.summary}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });

    filterBtn.textContent = '✖️ Clear Filter';
    filterBtn.classList.add('btn-primary');
    filterBtn.classList.remove('btn-secondary');

    renderFilteredArticles();
    totalArticlesEl.textContent = `${filteredArticles.length} / ${articles.length}`;
  } else {
    // Show all articles
    filterBtn.textContent = '🔍 Filter Articles';
    filterBtn.classList.remove('btn-primary');
    filterBtn.classList.add('btn-secondary');

    renderArticles();
    totalArticlesEl.textContent = articles.length.toString();
  }
}

// Render keywords
function renderKeywords() {
  if (keywords.length === 0) {
    keywordList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">No keywords added yet (add at least 4 for best results)</p>';
    return;
  }

  keywordList.innerHTML = `
    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">
      Keywords (${keywords.length}):
    </p>
    ${keywords.map(keyword => `
      <div class="feed-tag" style="background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.3);">
        <span style="color: var(--accent-primary); font-weight: 600;">${escapeHtml(keyword)}</span>
        <button onclick="window.removeKeyword('${escapeHtml(keyword)}')">×</button>
      </div>
    `).join('')}
  `;
}

// Render filtered articles with keyword highlighting
function renderFilteredArticles() {
  if (filteredArticles.length === 0) {
    articlesGrid.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3>No matching articles</h3>
        <p>No articles found matching your keywords. Try different keywords or fetch more articles.</p>
      </div>
    `;
    return;
  }

  articlesGrid.innerHTML = filteredArticles.map(article => {
    const highlightedTitle = highlightKeywords(article.title);
    const highlightedSummary = highlightKeywords(article.summary || 'No summary available');

    return `
      <div class="article-card" style="border-color: var(--accent-primary);">
        <div class="article-meta">
          <span class="article-source">${escapeHtml(article.source || 'Unknown')}</span>
          <span>${formatDate(article.published)}</span>
        </div>
        <h3 class="article-title">${highlightedTitle}</h3>
        <p class="article-summary">${highlightedSummary}</p>
        <a href="${escapeHtml(article.link)}" target="_blank" class="article-link">
          Read More →
        </a>
      </div>
    `;
  }).join('');
}

// Highlight keywords in text
function highlightKeywords(text: string): string {
  let highlightedText = escapeHtml(text);

  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; padding: 0.1rem 0.3rem; border-radius: 3px; font-weight: 600;">$1</mark>');
  });

  return highlightedText;
}

// Expose functions to window for onclick handlers
(window as any).removeFeed = removeFeed;
(window as any).removeKeyword = removeKeyword;
