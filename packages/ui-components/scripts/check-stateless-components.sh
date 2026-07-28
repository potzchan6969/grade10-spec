#!/usr/bin/env bash

set -euo pipefail

component_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src"
forbidden_pattern='(useState|useReducer|useEffect|createContext|useContext|fetch\(|axios|localStorage|sessionStorage|window\.|document\.|react-router|next/navigation|zustand|redux|tanstack|analytics)'

if rg --line-number --glob '*.{ts,tsx}' "$forbidden_pattern" "$component_root"; then
  echo "Shared components must be stateless and app-neutral. Pass state and behavior through props instead." >&2
  exit 1
fi

echo "Stateless component check passed."
