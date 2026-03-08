import os, json
import anthropic
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM = """You are a senior software engineer doing a thorough code review.
Analyze the provided git diff and return ONLY a valid JSON object, no markdown, no explanation.

Schema:
{
  "verdict": "approve | request_changes | needs_discussion",
  "summary": "2-3 sentence overall summary",
  "findings": [
    {
      "category": "bug | security | performance | style",
      "severity": "high | medium | low",
      "file": "filename or null",
      "line": "line reference or null",
      "issue": "description of the problem",
      "suggestion": "how to fix it"
    }
  ]
}

If no issues found, return an empty findings array with a positive summary."""

async def review_diff(diff: str) -> dict:
    if len(diff) > 30000:
        diff = diff[:30000] + "\n... (diff truncated)"

    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        system=SYSTEM,
        messages=[{"role": "user", "content": f"Review this diff:\n\n{diff}"}],
    )
    raw = msg.content[0].text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)