#!/usr/bin/env bash

set -euo pipefail

component_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src"
forbidden_everywhere='(useState|useReducer|createContext|useContext|fetch\(|axios|localStorage|sessionStorage|react-router|next/navigation|zustand|redux|tanstack|analytics)'
forbidden_outside_runtime='(useEffect|useLayoutEffect|useRef|ResizeObserver|window\.|document\.)'

if rg --line-number --glob '*.{ts,tsx}' "$forbidden_everywhere" "$component_root"; then
  echo "Shared components must not own application state or external integrations. Pass state and behavior through props instead." >&2
  exit 1
fi

outside_runtime_files="$(rg --files -g '*.{ts,tsx}' "$component_root" | rg -v '^.*/FeaturedMarkets/chart-runtime/')"
if [[ -n "$outside_runtime_files" ]] && rg --line-number "$forbidden_outside_runtime" $outside_runtime_files; then
  echo "Refs, effects, and browser APIs are limited to documented DOM-backed visual runtimes." >&2
  exit 1
fi

echo "Stateless component check passed."
