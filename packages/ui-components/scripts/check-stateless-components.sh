#!/usr/bin/env bash

set -euo pipefail

component_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src"
forbidden_external_integration='(fetch\(|axios|XMLHttpRequest|WebSocket|EventSource|localStorage|sessionStorage|react-router|next/navigation|zustand|redux|tanstack|analytics|launchdarkly|unleash)'

if rg --line-number --glob '*.{ts,tsx}' "$forbidden_external_integration" "$component_root"; then
  echo "Shared components must not access external data, persistence, application stores, routing, analytics, or feature flags. Consumers pass external state and behavior through props." >&2
  exit 1
fi

echo "App-neutral component check passed."
