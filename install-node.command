#!/bin/bash

echo ""
echo "==================================="
echo "  Node.js Installer for Newsletter Studio"
echo "==================================="
echo ""

# Check if Homebrew is available
if command -v /opt/homebrew/bin/brew &>/dev/null || command -v /usr/local/bin/brew &>/dev/null; then
    BREW=$(command -v /opt/homebrew/bin/brew || command -v /usr/local/bin/brew)
    echo "✅ Homebrew found — installing Node.js via Homebrew..."
    echo ""
    "$BREW" install node
    echo ""
    echo "✅ Node.js installed! Starting Newsletter Studio..."
    echo ""
    cd "/Users/barneybus/Documents/Claude/Projects/Newsletter Social/newsletter-studio"
    node server.js
else
    echo "Homebrew not found — downloading the official Node.js installer..."
    echo ""
    TMPFILE=$(mktemp /tmp/node-installer.XXXXXX.pkg)
    # Download latest Node.js LTS for macOS ARM64
    curl -L --progress-bar "https://nodejs.org/dist/lts/node-v22.14.0-arm64.pkg" -o "$TMPFILE"
    echo ""
    echo "Opening installer — follow the prompts to install Node.js."
    echo "Once installed, close this window and double-click run.command to start the app."
    echo ""
    open "$TMPFILE"
fi

echo ""
echo "Press Enter to close..."
read
