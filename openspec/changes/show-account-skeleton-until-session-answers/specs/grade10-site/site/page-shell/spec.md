# grade10-site/site/page-shell Specification

## Feature set

- Session-independent chrome
  - Account placeholder: until the session first answers, the account entry
    is a placeholder the size of the account icon, with nothing to press; a
    later re-read keeps the entry shown, and a failed read shows Sign In
  - Stable layout: no chrome control appears or disappears when the session
    arrives; only the account entry's own change in width moves the controls
    to its left
