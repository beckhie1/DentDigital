#!/bin/zsh
# CRM → Meta sync trigger. Hits the Vercel crm-sync endpoint so funnel events
# reach Meta within ~2h instead of once a day (Vercel Hobby cron limit).
# Installed as launchd job com.dentdigital.crmsync (every 2h, 08–20 daily).
set -u

ENV_FILE="$HOME/.dentdigital/.env.local"
LOG="$HOME/.dentdigital/outreach/crm-sync.log"

CRON_SECRET=$(grep '^CRON_SECRET=' "$ENV_FILE" | cut -d= -f2)
if [[ -z "$CRON_SECRET" ]]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: CRON_SECRET missing in $ENV_FILE" >> "$LOG"
  exit 1
fi

RES=$(curl -sS --max-time 55 -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.dentdigital.no/api/crm-sync" 2>&1)
echo "$(date '+%Y-%m-%d %H:%M:%S') $RES" >> "$LOG"
