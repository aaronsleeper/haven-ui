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

# Andrey's tree is a yarn workspace; package.json uses `link:` for @dataconnect/generated.
# npm doesn't support `link:` — rewrite to `file:` (same semantics; npm-compatible).
# This is a gate-workspace adaptation, not an upstream change.
echo "==> Adapting package.json (link: → file: for @dataconnect/generated; npm-vs-yarn shim)"
sed -i '' 's|"link:src/dataconnect-generated"|"file:src/dataconnect-generated"|' ./package.json

echo "==> Copying @dataconnect/generated (required for type resolution)"
# Patient SDK is a `link:src/dataconnect-generated` in patients/package.json.
# Populate BOTH node_modules (for type resolution) AND the link target (so npm's
# `link:` dep resolution doesn't break during install).
if [[ -d "${ANDREY_TREE}/src/dataconnect-generated" ]]; then
  mkdir -p ./node_modules/@dataconnect
  cp -R "${ANDREY_TREE}/src/dataconnect-generated" ./node_modules/@dataconnect/generated
  mkdir -p ./src
  cp -R "${ANDREY_TREE}/src/dataconnect-generated" ./src/dataconnect-generated
else
  echo "    ERROR: @dataconnect/generated not found at ${ANDREY_TREE}/src/dataconnect-generated"
  echo "    Patient SDK has not been generated. Run:"
  echo "      cd ${VAULT_ROOT}/Lab/cena-health-spark && yarn install && yarn sdk:generate"
  echo "    Then re-run this setup script."
  exit 1
fi

echo "==> Copying @cena/catalog-ui source into ${GATE_WORKSPACE}/src/lib/catalog-ui/"
cp -R "${CATALOG_SRC}/." ./src/lib/catalog-ui/

echo "==> Copying Andrey's tier 2+3 services (real Data Connect contract for emission)"
mkdir -p ./src/app/services
cp "${ANDREY_TREE}/src/app/services/dataconnect.service.ts" ./src/app/services/dataconnect.service.ts
cp "${ANDREY_TREE}/src/app/services/patient-data.service.ts" ./src/app/services/patient-data.service.ts

echo "==> Patching tsconfig.json with catalog path mappings (@cena/catalog-ui + @/* internals)"
python3 - <<'EOF'
import json
with open('./tsconfig.json', 'r') as f:
    cfg = json.load(f)
paths = cfg.setdefault('compilerOptions', {}).setdefault('paths', {})
paths['@cena/catalog-ui'] = ['lib/catalog-ui/index']
paths['@/*'] = ['lib/catalog-ui/*']
with open('./tsconfig.json', 'w') as f:
    json.dump(cfg, f, indent=2)
print('    tsconfig paths now:', list(paths.keys()))
EOF

echo "==> Running npm install with --legacy-peer-deps"
# Reason: @angular/fire@20.0.1 peer-conflicts with @angular/common@^21.2.13 in
# Andrey's tree. This is a real smell on the plan's Remaining list — flagging,
# not silencing. Gate makes it empirical; EVIDENCE.md records it.
npm install --legacy-peer-deps

echo "==> Running baseline tsc --noEmit"
npx tsc --noEmit

echo "==> Baseline gate PASSED. Workspace at ${GATE_WORKSPACE} ready for E1/E2 emission."
echo ""
echo "Next: emit E1 (Care-team messages) into ${GATE_WORKSPACE}/src/app/care-team/messages/"
echo "Then re-run: cd ${GATE_WORKSPACE} && npx tsc --noEmit && npx ng test --watch=false"
echo "And then: cd ${VAULT_ROOT} && python3 .claude/scripts/invariants.py"
