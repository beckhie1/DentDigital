#!/bin/zsh
# DentDigital vask-outreach – kjøres av launchd hverdager 15:00
DIR="$HOME/.dentdigital/outreach"
NODE="$HOME/.nvm/versions/node/v20.19.4/bin/node"
LIMIT="${1:-10}"
LOG="$DIR/vask-cron.log"

cd "$DIR" || exit 1

# Catch-up guard (RunAtLoad fires at boot/login): only send on weekdays,
# between 15:00 and 20:00, and max once per day.
DOW="$(date '+%u')"
NOWMIN=$(( 10#$(date '+%H') * 60 + 10#$(date '+%M') ))
TODAY="$(date '+%Y-%m-%d')"
if (( DOW > 5 )); then echo "skip: weekend"; exit 0; fi
if (( NOWMIN < 900 || NOWMIN > 1200 )); then echo "skip: outside 15:00-20:00"; exit 0; fi
if grep -q "^===== $TODAY .*vask run" "$LOG" 2>/dev/null && grep -q "$(date -u '+%Y-%m-%d')T" "$DIR/vask-sent.log" 2>/dev/null; then echo "skip: already sent today"; exit 0; fi

# vent på nett (maks 2 min)
for i in {1..8}; do
  curl -s -m 5 https://api.resend.com >/dev/null 2>&1 && break
  sleep 15
done

REMAINING=$($NODE send-vask.mjs --limit 1 2>/dev/null | head -1 | sed 's/[^0-9]*\([0-9]*\).*/\1/')
echo "===== $(date '+%Y-%m-%d %H:%M:%S')  vask run (limit $LIMIT, remaining $REMAINING) =====" >> "$LOG"
$NODE send-vask.mjs --send --limit "$LIMIT" >> "$LOG" 2>&1
