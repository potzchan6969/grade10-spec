# @grade10/i18n

Source of truth for user-facing copy. `messages/en.json` is the base catalog; other locales
translate any subset and fall back to `en` key-by-key via `getMessages(locale)`. Consumers bring
their own renderer (`use-intl` in the application repositories).

Adding a locale: create `messages/<locale>.json`, register it in `src/index.ts`.
