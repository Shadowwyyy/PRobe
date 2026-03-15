import httpx

def parse_pr_url(url: str) -> tuple[str, str, int]:
    parts = url.rstrip("/").split("/")
    owner = parts[-4]
    repo = parts[-3]
    pr_num = int(parts[-1])
    return owner, repo, pr_num

async def fetch_pr_data(pr_url: str) -> dict:
    owner, repo, pr_num = parse_pr_url(pr_url)
    base = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_num}"

    async with httpx.AsyncClient() as client:
        meta_res = await client.get(
            base,
            headers={"Accept": "application/vnd.github.v3+json"},
            follow_redirects=True,
            timeout=15.0,
        )
        if meta_res.status_code != 200:
            raise ValueError(f"GitHub returned {meta_res.status_code} for that PR -- double check the URL")

        diff_res = await client.get(
            base,
            headers={"Accept": "application/vnd.github.v3.diff"},
            follow_redirects=True,
            timeout=15.0,
        )

        meta = meta_res.json()
        return {
            "diff": diff_res.text,
            "meta": {
                "title": meta["title"],
                "author": meta["user"]["login"],
                "avatar": meta["user"]["avatar_url"],
                "num": meta["number"],
                "repo": f"{owner}/{repo}",
                "additions": meta["additions"],
                "deletions": meta["deletions"],
                "changed_files": meta["changed_files"],
                "state": meta["state"],
            }
        }