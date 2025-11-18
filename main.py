from app.scrapers.rss_scraper import RSSScraper
from app.agent.news_agent import NewsAgent

def main():
    print("Starting AI News Aggregator...")
    
    # Example tech news feeds
    feeds = [
        "http://feeds.bbci.co.uk/news/technology/rss.xml",
        "https://techcrunch.com/feed/"
    ]
    
    scraper = RSSScraper(feeds)
    print(f"Scraping {len(feeds)} feeds...")
    articles = scraper.scrape()
    print(f"Collected {len(articles)} articles.")
    
    agent = NewsAgent()
    print("Summarizing news...")
    summary = agent.summarize(articles)
    
    print("\n=== News Summary ===\n")
    print(summary)

if __name__ == "__main__":
    main()
