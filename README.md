# Pagehide event bug in Chrome/Edge

See https://issues.chromium.org/issues/41497009.

## Bug: pagehide event is fired to late

*copied from bugs.chromium.org as it is missing in issues.chromium.org*

### What steps will reproduce the problem?
1. Open a page that opens a EventSource connection. That connection should be closed on a pagehide event. Log the connection close event on the server.
2. Navigate to another page (current page will be put into bfcache).
3. Navigate back with the back-button (page is loaded from bfcache).

### What is the expected result?
After step 1 the close event should be logged on the server.

### What happens instead?
Current behavior in Chrome and Edge: The close event is logged on step 3.

### Please provide any additional information below. Attach a screenshot if possible.

The current behavior means, that the pagehide event is triggered when going back to a page from the bfcache (and not before). It's like it catches up on the events that should be fired earlier.

In Firefox it is working as expected.


## Run example

This example differs a little bit form the steps above to show the issue a little bit clearer.

* Run `node server.mjs` in console.
* Open `http://localhost:8000` in **Chrome** browser (`121.0.6167.140 (Offizieller Build) (64-Bit) (cohort: Stable)`).
* Follow instructions and see SSE connections in the console that **are not** getting closed on navigation.
* Open `http://localhost:8000` in **Firefox** browser (`122.0.1 (64-Bit)`).
* Follow instructions and see SSE connections in the console that **are** getting closed on navigation.
