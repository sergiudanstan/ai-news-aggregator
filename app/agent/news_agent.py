import os
# from anthropic import Anthropic

class NewsAgent:
    def __init__(self):
        # self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        pass

    def summarize(self, articles: list) -> str:
        if not articles:
            return "No articles to summarize."
        
        # Mock summary for now
        summary = f"Found {len(articles)} articles.\n\n"
        for i, article in enumerate(articles[:5]): # Just show top 5
            summary += f"{i+1}. {article['title']}\n"
        
        return summary
