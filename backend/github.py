import httpx

def parse_pr_url(url: str) -> tuple[str, str, int]:
    # https://github.com/owner/repo/pull/123
    parts = url.rstrip("/").split("/")
    owner = parts[-4]
    repo = parts[-3]
    pr_num = int(parts[-1])
    return owner, repo, pr_num

async def fetch_diff(pr_url: str) -> str:
    owner, repo, pr_num = parse_pr_url(pr_url)
    api_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_num}"
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            api_url,
            headers={"Accept": "application/vnd.github.v3.diff"},
            follow_redirects=True,
            timeout=15.0,
        )
        if resp.status_code != 200:
            raise ValueError(f"GitHub returned {resp.status_code} for that PR -- double check the URL")
        return resp.text
