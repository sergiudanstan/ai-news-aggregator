import feedparser
from typing import List, Dict

class RSSScraper:
    def __init__(self, urls: List[str]):
        self.urls = urls

    def scrape(self) -> List[Dict]:
        articles = []
        for url in self.urls:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                articles.append({
                    "title": entry.get("title", ""),
                    "link": entry.get("link", ""),
                    "summary": entry.get("summary", ""),
                    "published": entry.get("published", "")
                })
        return articles
