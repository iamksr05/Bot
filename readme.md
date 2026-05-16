## The Entirety Bot

Legacy message-command Discord bot powered by `discord.js@12`. This repo now
contains the pieces you need to run it locally and deploy it to Render without
hard-coding secrets.

### Requirements
- Node.js 16.x (matches Discord.js v12 support window)
- A Discord bot token with the **MESSAGE CONTENT INTENT** enabled
- MongoDB connection string (used by `discord-xp`)

### Local setup
1. Install dependencies  
   `npm install`
2. Duplicate `env.example` → `.env` and fill out all fields:
   - `DISCORD_TOKEN`
   - `PREFIX`
   - `MONGOPATH`
   - `OPENAI_KEY` (optional, only for AI-powered commands)
3. Start the bot  
   `node main.js`

### Deploying to Render
This repo now ships with a `render.yaml` blueprint configured as a **worker**
service so Render keeps the bot online 24/7 without health-check failures.

Steps:
1. Create three Render Secrets named `discord-token`, `MONGOPATH`, and
   `OPENAI_KEY` (leave any unused secret empty).
2. Click **New +** → **Blueprint** in Render and connect this repository.
3. Deploy. Render will run `npm install` then `node main.js` from the worker.

### Procfile
If you also deploy to Heroku or other PaaS, the `Procfile` now exposes the bot
as a `worker` dyno, which is the correct process type for long-running bots.

