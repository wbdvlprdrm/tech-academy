# Tech Academy lead form MVP

A static, dependency-free lead form for validating interest in the first cohort.

## Run locally

From this directory, run `python3 -m http.server 8000` and open <http://localhost:8000>.

## Lead destination

`app.js` defines the `leadDestination.submit(lead)` adapter. It currently logs the validated lead locally and does not transmit or persist it. Replace that adapter when a destination is selected; the form and field schema can stay in place.
