# Sonar Setup

`agent_team` scheduler now auto-loads local env files in this order:

1. `.env`
2. `agent_team/.env`
3. `agent_team/.sonar.env`

Existing OS environment variables always take precedence.

## One-command setup

```bash
python agent_team/configure_sonar.py --host http://YOUR_SONAR_HOST:9000 --project YOUR_PROJECT_KEY --token YOUR_TOKEN --branch main --check
```

This writes `agent_team/.sonar.env` (ignored by git) and can run a connectivity check.

## Manual file format

Create `agent_team/.sonar.env`:

```env
SONAR_HOST_URL=http://localhost:9000
SONAR_PROJECT_KEY=my-project
SONAR_TOKEN=xxxxxxxx
SONAR_BRANCH=main
```

