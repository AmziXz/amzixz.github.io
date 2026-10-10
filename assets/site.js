/* Everything on the page that moves or ticks.
 *
 * 1. The loading screen: counts to 100 and lifts, on the first page of a
 *    visit only (the script in <head> decides that).
 * 2. The Tallinn clock in the corner of the first screen.
 * 3. The light: two pools of purple and blue that follow the pointer, each
 *    at its own speed, easing rather than snapping.
 * 4. The giant AmziXz is sized to fill the width.
 * 5. On the home page, the floating menu lights the chapter you are in.
 *
 * Under prefers-reduced-motion the light stays still and the loading screen
 * never shows. Without this script the page reads normally: the name has a
 * CSS size, the light sits in its resting place, the clock shows dashes.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- 1. Loading screen ---------- */

  if (root.classList.contains("is-loading")) {
    var count = document.querySelector(".loader-count b");
    var bar = document.querySelector(".loader-bar");
    var started = performance.now();
    var DURATION = 1000;
    var tick = function (now) {
      var p = Math.min(1, (now - started) / DURATION);
      var eased = 1 - Math.pow(1 - p, 3);
      if (count) count.textContent = String(Math.round(eased * 100));
      if (bar) bar.style.setProperty("--p", eased.toFixed(3));
      if (p < 1) {
        requestAnimationFrame(tick);
        return;
      }
      root.classList.add("is-lifting");
      setTimeout(function () {
        root.classList.remove("is-loading", "is-lifting");
      }, 850);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- 2. Clock ---------- */

  var clock = document.querySelector("[data-clock]");
  if (clock && window.Intl) {
    var lang = clock.getAttribute("data-lang") || "en";
    var zone = "Europe/Tallinn";
    var timeEl = clock.querySelector("[data-clock-time]");
    var dateEl = clock.querySelector("[data-clock-date]");
    var timeFmt = new Intl.DateTimeFormat(lang === "lv" ? "lv-LV" : "en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    var dateFmt = new Intl.DateTimeFormat(lang === "lv" ? "lv-LV" : "en-GB", {
      timeZone: zone,
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    var render = function () {
      var now = new Date();
      if (timeEl) timeEl.textContent = timeFmt.format(now);
      if (dateEl) dateEl.textContent = dateFmt.format(now);
    };
    render();
    setInterval(render, 1000);
  }

  /* ---------- 3. The light ---------- */

  var hero = document.querySelector(".hero");
  var light = hero && hero.querySelector(".hero-light");
  if (light) {
    var pos = { ax: 0.3, ay: 0.45, bx: 0.75, by: 0.6 };
    var goal = { ax: 0.3, ay: 0.45, bx: 0.75, by: 0.6 };
    var moving = false;

    var frame = function () {
      var still = true;
      for (var key in goal) {
        var d = goal[key] - pos[key];
        if (Math.abs(d) > 0.0005) still = false;
        /* The purple pool is quicker than the blue: depth. */
        pos[key] += d * (key.charAt(0) === "a" ? 0.08 : 0.045);
      }
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      light.style.setProperty("--ax", (pos.ax * w).toFixed(1) + "px");
      light.style.setProperty("--ay", (pos.ay * h).toFixed(1) + "px");
      light.style.setProperty("--bx", (pos.bx * w).toFixed(1) + "px");
      light.style.setProperty("--by", (pos.by * h).toFixed(1) + "px");
      if (still) {
        moving = false;
        return;
      }
      requestAnimationFrame(frame);
    };

    var onMove = function (event) {
      if (reduced.matches || event.pointerType === "touch") return;
      var box = hero.getBoundingClientRect();
      if (event.clientY > box.bottom) return;
      var x = (event.clientX - box.left) / box.width;
      var y = (event.clientY - box.top) / box.height;
      goal.ax = x;
      goal.ay = y;
      /* The blue pool answers from the opposite side. */
      goal.bx = 1 - x * 0.6;
      goal.by = 0.35 + y * 0.4;
      if (!moving) {
        moving = true;
        requestAnimationFrame(frame);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    requestAnimationFrame(frame);
  }

  /* ---------- 4. The name, fitted ---------- */

  var name = document.querySelector(".hero-name");
  var wide = window.matchMedia("(min-width: 48rem)");
  var fit = function () {
    if (!name || !hero) return;
    name.style.fontSize = "";
    var inner = name.firstElementChild;
    if (!inner) return;
    var base = parseFloat(window.getComputedStyle(name).fontSize);
    var natural = inner.getBoundingClientRect().width;
    if (!natural) return;
    /* As wide as the column... */
    var size = Math.min((base * name.clientWidth) / natural, 360);
    name.style.fontSize = size.toFixed(1) + "px";
    /* ...unless that pushes the first screen past the window: then shrink
       by exactly the overflow (the name's box is 0.86 of its font size).
       Phones scroll, so they keep the width fit. */
    if (!wide.matches) return;
    var over = hero.offsetHeight - window.innerHeight;
    if (over > 0) {
      size = Math.max(size - over / 0.86, base * 0.6);
      name.style.fontSize = size.toFixed(1) + "px";
    }
  };
  fit();
  window.addEventListener("resize", function () {
    requestAnimationFrame(fit);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* ---------- 5. The chapter you are in ---------- */

  var links = Array.prototype.slice.call(document.querySelectorAll('.dock a[href*="#"]'));
  var homeLink = document.querySelector('.dock a[aria-current="page"]');
  var targets = links
    .map(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      var el = id && document.getElementById(id);
      return el ? { a: a, el: el } : null;
    })
    .filter(Boolean);
  if (targets.length && "IntersectionObserver" in window) {
    var current = null;
    var light2 = function () {
      var y = window.innerHeight * 0.4;
      var hit = null;
      targets.forEach(function (t) {
        if (t.el.getBoundingClientRect().top <= y) hit = t;
      });
      if (hit === current) return;
      current = hit;
      targets.forEach(function (t) {
        t.a.classList.toggle("is-current", t === hit);
      });
      if (homeLink) homeLink.toggleAttribute("aria-current", !hit);
      if (homeLink && !hit) homeLink.setAttribute("aria-current", "page");
    };
    window.addEventListener("scroll", function () {
      requestAnimationFrame(light2);
    }, { passive: true });
    light2();
  }
})();
