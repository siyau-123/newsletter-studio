#!/bin/bash

# Try common node locations
for NODE_CANDIDATE in \
    /opt/homebrew/bin/node \
    /usr/local/bin/node \
    /opt/local/bin/node \
    "$HOME/.volta/bin/node" \
    "$HOME/.local/bin/node" \
    "$HOME/.nodenv/shims/node"; do
    if [ -x "$NODE_CANDIDATE" ]; then
        NODE="$NODE_CANDIDATE"
        break
    fi
done

# Try nvm as a fallback
if [ -z "$NODE" ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    NODE=$(command -v node 2>/dev/null)
fi

# Try fnm as a fallback
if [ -z "$NODE" ] && [ -x "$HOME/.fnm/fnm" ]; then
    eval "$($HOME/.fnm/fnm env)"
    NODE=$(command -v node 2>/dev/null)
fi

if [ -z "$NODE" ]; then
    echo ""
    echo "Could not find Node.js. Please install it from https://nodejs.org"
    echo "Then run: node server.js"
    echo ""
    echo "Press Enter to close..."
    read
    exit 1
fi

echo "Using node at: $NODE"
cd "/Users/barneybus/Documents/Claude/Projects/Newsletter Social/newsletter-studio"
"$NODE" server.js
