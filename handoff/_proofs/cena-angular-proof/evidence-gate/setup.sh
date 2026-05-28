#!/usr/bin/env bash
# Mechanical evidence gate — workspace setup
# See README.md in this directory for context.
# Run from any directory; the script self-resolves vault root.

set -euo pipefail

VAULT_ROOT="/Users/aaronsleeper/Vaults"
ANDREY_TREE="${VAULT_ROOT}/Lab/cena-health-spark/patients"
CATALOG_SRC="${VAULT_ROOT}/Lab/haven-ui/packages/angular-patterns/src"
GATE_WORKSPACE="/tmp/cena-evidence-gate"

echo "==> Mechanical evidence gate setup"
echo "    Andrey tree: ${ANDREY_TREE}"
echo "    Catalog src: ${CATALOG_SRC}"
echo "    Gate workspace: ${GATE_WORKSPACE}"

# Idempotent: move previous workspace to a delete-sibling per reversibility convention.
if [[ -d "${GATE_WORKSPACE}" ]]; then
  TS=$(date +%s)
  echo "==> Existing workspace found; moving to ${GATE_WORKSPACE}.delete.${TS}"
  mv "${GATE_WORKSPACE}" "${GATE_WORKSPACE}.delete.${TS}"
fi

mkdir -p "${GATE_WORKSPACE}/src/lib/catalog-ui"
cd "${GATE_WORKSPACE}"

echo "==> Copying Andrey's package.json + tsconfig + angular.json"
cp "${ANDREY_TREE}/package.json" ./package.json
cp "${ANDREY_TREE}/tsconfig.json" ./tsconfig.json
cp "${ANDREY_TREE}/tsconfig.app.json" ./tsconfig.app.json 2>/dev/null || true
cp "${ANDREY_TREE}/tsconfig.spec.json" ./tsconfig.spec.json 2>/dev/null || true
cp "${ANDREY_TREE}/angular.json" ./angular.json 2>/dev/null || true

echo "==> Copying @dataconnect/generated (required for type resolution)"
if [[ -d "${ANDREY_TREE}/../dataconnect/generated" ]]; then
  mkdir -p ./node_modules/@dataconnect
  cp -R "${ANDREY_TREE}/../dataconnect/generated" ./node_modules/@dataconnect/generated
elif [[ -d "${ANDREY_TREE}/node_modules/@dataconnect/generated" ]]; then
  mkdir -p ./node_modules/@dataconnect
  cp -R "${ANDREY_TREE}/node_modules/@dataconnect/generated" ./node_modules/@dataconnect/generated
else
  echo "    WARN: @dataconnect/generated not found in expected locations."
  echo "    Check ${ANDREY_TREE}/../dataconnect/ or his node_modules."
  echo "    Continuing; npm install will fail on the @dataconnect/* peer if it can't be resolved."
fi

echo "==> Copying @cena/catalog-ui source into ${GATE_WORKSPACE}/src/lib/catalog-ui/"
cp -R "${CATALOG_SRC}/." ./src/lib/catalog-ui/

echo "==> Running npm install (this is the step that's harness-gated; run in terminal)"
npm install

echo "==> Running baseline tsc --noEmit"
npx tsc --noEmit

echo "==> Baseline gate PASSED. Workspace at ${GATE_WORKSPACE} ready for E1/E2 emission."
echo ""
echo "Next: emit E1 (Care-team messages) into ${GATE_WORKSPACE}/src/app/care-team/messages/"
echo "Then re-run: cd ${GATE_WORKSPACE} && npx tsc --noEmit && npx ng test --watch=false"
echo "And then: cd ${VAULT_ROOT} && python3 .claude/scripts/invariants.py"
