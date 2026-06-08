#!/bin/bash
# Wrapper for launchd to run the Haven theme editor under the right Node version.
#
# launchd doesn't inherit interactive-shell PATH or sourced nvm config, so
# `pnpm` isn't on PATH by default. This wrapper sources nvm to make pnpm/node
# resolvable, then execs `pnpm dev` in the theme-editor package.
#
# Resource cost: a Vite dev server (~150 MB RAM idle + file watcher on the
# haven-ui workspace). Acceptable for an always-on browser-accessible tool
# Aaron uses to author Obsidian theme presets.
#
# Port: 5178 (strictPort in vite.config.ts). Owned by the same launchd label
# this script is invoked under (com.aaronsleeper.haven-theme-editor) per
# Lab/vault-constellation/places.config.yaml.

set -euo pipefail

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")/.."

exec pnpm dev
