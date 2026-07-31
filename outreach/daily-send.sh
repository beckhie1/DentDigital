#!/bin/zsh
# DentDigital daily drip sender — invoked by launchd (com.dentdigital.outreach).
# Sends a safe daily batch; send.mjs skips anyone already in sent.log,
# so this drips through clinics.csv over several weekdays and stops when empty.
NODE="/Users/umar/.nvm/versions/node/v20.19.4/bin/node"
DIR="/Users/umar/Documents/DEV/DentDigital/DentDigital/outreach"
LIMIT="${1:-15}"

cd "$DIR" || exit 1

# Catch-up guard (RunAtLoad fires at boot/login): only send on weekdays,
# between 09:20 and 18:00, and max once per day.
DOW="$(date '+%u')"
NOWMIN=$(( 10#$(date '+%H') * 60 + 10#$(date '+%M') ))
TODAY="$(date '+%Y-%m-%d')"
if (( DOW > 5 )); then echo "skip: weekend"; exit 0; fi
if (( NOWMIN < 560 || NOWMIN > 1080 )); then echo "skip: outside 09:20-18:00"; exit 0; fi
if grep -q "^===== $TODAY .*run" cron.log 2>/dev/null && grep -q "$(date -u '+%Y-%m-%d')T" sent.log 2>/dev/null; then echo "skip: already sent today"; exit 0; fi

# Wait up to 2 min for network (Mac may wake at 09:20 before Wi-Fi is up).
for i in {1..8}; do
  curl -s -m 5 -o /dev/null https://api.resend.com && break
  echo "network not ready, retry $i/8"
  sleep 15
done

# Nothing left? log and exit quietly.
REMAINING="$("$NODE" send.mjs 2>/dev/null | grep -o '^[0-9]\+ unsent' | grep -o '^[0-9]\+')"
{
  echo "===== $(date '+%Y-%m-%d %H:%M:%S')  run (limit $LIMIT, remaining ${REMAINING:-?}) ====="
} >> cron.log

if [ "${REMAINING:-1}" = "0" ]; then
  echo "Queue empty — campaign complete. Nothing to send." >> cron.log
  echo "" >> cron.log
  exit 0
fi

"$NODE" send.mjs --send --limit "$LIMIT" >> cron.log 2>&1
echo "" >> cron.log
