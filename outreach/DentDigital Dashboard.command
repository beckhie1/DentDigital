#!/bin/zsh
# DentDigital Dashboard launcher — double-click to open.
# Starts the local dashboard server if it isn't already running, then opens the browser.
NODE="/Users/umar/.nvm/versions/node/v20.19.4/bin/node"
SCRIPT="/Users/umar/Documents/DEV/DentDigital/DentDigital/outreach/dashboard.mjs"
LOG="$HOME/.dentdigital/outreach/dashboard.log"
URL="http://127.0.0.1:4321"

if ! curl -s -o /dev/null --max-time 1 "$URL"; then
  mkdir -p "$(dirname "$LOG")"
  nohup "$NODE" "$SCRIPT" >> "$LOG" 2>&1 &
  # wait for the server to come up (max ~5 s)
  for i in {1..25}; do
    curl -s -o /dev/null --max-time 1 "$URL" && break
    sleep 0.2
  done
fi

open "$URL"
