#!/bin/bash
# Wrapper for launchd to run the Haven pattern library dev server.
#
# launchd doesn't inherit interactive-shell PATH or sourced nvm config, so
# `pnpm` isn't on PATH by default. This wrapper sources nvm to make pnpm/node
# resolvable, then execs `pnpm dev` in the design-system package.
#
# Resource cost: a Vite dev server (~150 MB RAM idle + file watcher on the
# haven-ui workspace). Acceptable for an always-on browser-accessible spec
# surface Aaron + agents reach for constantly.
#
# Port: 5173 (strictPort in vite.config.ts). Owned by the same launchd label
# this script is invoked under (com.aaronsleeper.haven-pattern-library) per
# Lab/vault-constellation/places.config.yaml.
#
# Conflict note: running `pnpm dev` at the haven-ui workspace root will fail
# loudly on the design-system task because this launchd-owned server already
# holds 5173. Use `pnpm --filter '!@haven/design-system' dev` to run the rest.

set -euo pipefail

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")/.."

exec pnpm dev
