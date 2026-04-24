#!/bin/bash
# Kill any existing newsletter server
pkill -f "node.*server.js" 2>/dev/null
sleep 1

# Start fresh
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
cd "/Users/barneybus/Documents/Claude/Projects/Newsletter Social/newsletter-studio"
echo ""
echo "🌿 Restarting Newsletter Studio..."
echo ""
node server.js &
sleep 1.5

# Open in browser
open http://localhost:3000
wait
