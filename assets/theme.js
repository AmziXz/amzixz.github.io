/* Light/dark persistence, mirroring lang.js.
 *
 * Loaded synchronously in <head>, NOT deferred: a deferred script runs after
 * first paint, so the wrong palette would flash before being corrected.
 *
 * Dark first (the owner's choice, 2026-10-10): a first visit is dark whatever
 * the system says. Once the sun/moon switch is clicked the choice is stored
 * and wins from then on, in both directions.
 *
 * With JavaScript off the page is dark (the stylesheet's default) and the
 * switch does nothing.
 */
(function () {
  "use strict";

  var KEY = "amzixz:theme";
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function store(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode, storage disabled — the choice simply does not persist */
    }
  }

  /* Applied before first paint. Everything below waits for the DOM. */
  var saved = read();
  root.setAttribute("data-theme", saved === "light" ? "light" : "dark");

  function effective() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function sync(button) {
    var dark = effective() === "dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute(
      "aria-label",
      button.getAttribute(dark ? "data-label-light" : "data-label-dark") ||
        (dark ? "Switch to light theme" : "Switch to dark theme")
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    sync(button);

    button.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store(next);
      sync(button);
    });

  });
})();
