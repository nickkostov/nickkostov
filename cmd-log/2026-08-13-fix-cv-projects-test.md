# Fix optional CV projects test

- The fixture removed `cv.sportsmodule.projects`, but the assertion inspected the first CV entry (`Endava`).
- Scoped the assertion to the `SportsModule` entry.
