from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from github import fetch_pr_data
from reviewer import review_diff
import httpx
import os

from pathlib import Path
load_dotenv(Path(__file__).parent / '.env')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

class ReviewReq(BaseModel):
    pr_url: str
    token: str | None = None

@app.get("/auth/github")
def github_login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&scope=repo"
    )

@app.get("/auth/callback")
async def github_callback(code: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        data = res.json()
        token = data.get("access_token")
        if not token:
            return RedirectResponse(f"http://localhost:5173?auth_error=true")
        return RedirectResponse(f"http://localhost:5173/callback?token={token}")

@app.get("/auth/user")
async def get_user(token: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        data = res.json()
        return {
            "login": data["login"],
            "avatar": data["avatar_url"],
            "name": data.get("name")
        }

@app.post("/review")
async def review(req: ReviewReq):
    try:
        pr_data = await fetch_pr_data(req.pr_url, token=req.token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch PR diff from GitHub")

    try:
        result = await review_diff(pr_data["diff"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return { **result, "meta": pr_data["meta"] }