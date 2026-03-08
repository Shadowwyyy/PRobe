from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from github import fetch_diff
from reviewer import review_diff

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewReq(BaseModel):
    pr_url: str

@app.post("/review")
async def review(req: ReviewReq):
    try:
        diff = await fetch_diff(req.pr_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch PR diff from GitHub")
    
    try:
        result = await review_diff(diff)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return result