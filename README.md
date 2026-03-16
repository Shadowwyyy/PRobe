# PRobe

AI-powered code review agent that analyzes GitHub PRs and surfaces bugs, security issues, and performance problems instantly.

![PRobe screenshot](./screenshot.png)

## what it does

Drop in a GitHub PR URL and get back a structured code review in seconds. PRobe fetches the diff, runs it through Claude, and returns categorized findings with severity ratings and fix suggestions.

## stack

- **backend** -- FastAPI, Python 3.11, Anthropic API
- **frontend** -- React, Vite

## running locally

**backend**

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add your keys
./venv/bin/python3.11 -m uvicorn main:app --reload
```

**frontend**

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 and paste any public GitHub PR URL.

## features

- fetches real PR diffs from GitHub's API
- structured review with bugs, security, performance, and style findings
- severity levels (high / medium / low) with file + line references
- filter findings by severity
- PR metadata header showing title, author, files changed, additions and deletions
- loading skeleton while review generates
- review history sidebar (persisted in localStorage)
- export review as markdown
- GitHub OAuth for private repo access

## env vars

```
ANTHROPIC_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## example

```
https://github.com/django/django/pull/1
```
