#!/bin/zsh
# DentDigital daily drip sender — invoked by launchd (com.dentdigital.outreach).
# Sends a safe daily batch; send.mjs skips anyone already in sent.log,
# so this drips through clinics.csv over several weekdays and stops when empty.
NODE="/Users/umar/.nvm/versions/node/v20.19.4/bin/node"
DIR="/Users/umar/Documents/DEV/DentDigital/DentDigital/outreach"
LIMIT="${1:-15}"

cd "$DIR" || exit 1

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
