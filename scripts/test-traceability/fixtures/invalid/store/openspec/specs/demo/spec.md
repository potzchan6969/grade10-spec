<!-- trace:scenario id=scn_duplicate key=visitor-signs-in rev=0 -->
#### Scenario: First duplicated scenario

<!-- trace:scenario id=scn_duplicate key=SC-01 rev=1 -->
#### Scenario: Second duplicated scenario

<!-- trace:case id=tcase_bad rev=1 covers=scn_missing -->
### demo-US1-TC1-1: A broken case

<!-- trace:case id=tcase_bad rev=1 covers=scn_duplicate -->
### demo-US1-TC2-1: A duplicated case

<!-- trace:case id=tcase_stale rev=1 covers=scn_duplicate -->
### demo-US1-TC3-1: A case with a stale app link
