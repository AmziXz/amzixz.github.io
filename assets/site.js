/* Everything on the page that moves or ticks.
 *
 * 1. The loading screen: counts to 100 and lifts, on the first page of a
 *    visit only (the script in <head> decides that).
 * 2. The Tallinn clock in the corner of the first screen.
 * 3. The light: two pools of purple and blue that follow the pointer, each
 *    at its own speed, easing rather than snapping. The ring light turns its
 *    bright side toward the pointer and drifts with it while the name drifts
 *    the other way, and the readout shows where the pointer is.
 * 4. The giant AmziXz is sized to fill the width.
 * 5. On the home page, the floating menu lights the chapter you are in.
 * 6. The main buttons lean a little toward the pointer.
 * 7. Blocks rise into place the first time they scroll into view, and
 *    cards light up under the pointer.
 * 8. The TikTok embed's script loads only when its box comes near; the
 *    Discord widget follows the theme; the top bar gets a backdrop once the
 *    page scrolls.
 *
 * Under prefers-reduced-motion nothing follows the pointer, nothing rises,
 * and the loading screen never shows. Without this script the page reads normally: the name
 * has a CSS size, the light and the ring sit in their resting places, the
 * clock shows dashes.
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
      if (count) {
        count.textContent = String(Math.round(eased * 100));
        /* The number gains weight as it climbs, up to the name's own. */
        count.style.fontWeight = String(Math.round(200 + eased * 220));
      }
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
  var name = document.querySelector(".hero-name");
  var light = hero && hero.querySelector(".hero-light");
  var halo = hero && hero.querySelector(".halo");
  var readX = hero && hero.querySelector("[data-readout-x]");
  var readY = hero && hero.querySelector("[data-readout-y]");
  if (light) {
    var pos = { ax: 0.3, ay: 0.45, bx: 0.75, by: 0.6, turn: 20 };
    var goal = { ax: 0.3, ay: 0.45, bx: 0.75, by: 0.6, turn: 20 };
    var moving = false;
    var pad = function (n) {
      return ("0000" + Math.max(0, Math.round(n))).slice(-4);
    };

    var frame = function () {
      var still = true;
      for (var key in goal) {
        var d = goal[key] - pos[key];
        if (Math.abs(d) > (key === "turn" ? 0.05 : 0.0005)) still = false;
        /* The purple pool is quicker than the blue: depth. The ring turns
           at the purple pool's pace. */
        pos[key] += d * (key.charAt(0) === "b" ? 0.045 : 0.08);
      }
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      light.style.setProperty("--ax", (pos.ax * w).toFixed(1) + "px");
      light.style.setProperty("--ay", (pos.ay * h).toFixed(1) + "px");
      light.style.setProperty("--bx", (pos.bx * w).toFixed(1) + "px");
      light.style.setProperty("--by", (pos.by * h).toFixed(1) + "px");
      /* Depth: the ring (far) drifts with the pointer, the name (near)
         against it, a few pixels each way. */
      var px = pos.ax - 0.5;
      var py = pos.ay - 0.5;
      if (halo) {
        halo.style.setProperty("--halo-turn", pos.turn.toFixed(2) + "deg");
        halo.style.setProperty("--sx", (px * 28).toFixed(1) + "px");
        halo.style.setProperty("--sy", (py * 18).toFixed(1) + "px");
      }
      if (name) name.style.translate = (px * -18).toFixed(1) + "px " + (py * -8).toFixed(1) + "px";
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
      if (halo) {
        /* The ring's bright side sits at the top of its gradient; turn it to
           face the pointer, the short way round. */
        var ring = halo.getBoundingClientRect();
        var angle = (Math.atan2(event.clientY - (ring.top + ring.height / 2), event.clientX - (ring.left + ring.width / 2)) * 180) / Math.PI + 90;
        var diff = ((((angle - goal.turn) % 360) + 540) % 360) - 180;
        goal.turn += diff;
      }
      if (readX) readX.textContent = pad(event.clientX - box.left);
      if (readY) readY.textContent = pad(event.clientY - box.top);
      if (!moving) {
        moving = true;
        requestAnimationFrame(frame);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    requestAnimationFrame(frame);
  }

  /* ---------- 4. The name, fitted ---------- */

  var wide = window.matchMedia("(min-width: 64rem)");
  var fit = function () {
    if (!name || !hero) return;
    name.style.fontSize = "";
    var inner = name.firstElementChild;
    if (!inner) return;
    var base = parseFloat(window.getComputedStyle(name).fontSize);
    var natural = inner.getBoundingClientRect().width;
    if (!natural) return;
    /* As wide as the frame (the name itself is centred, so measure the box
       it sits in)... */
    var box = window.getComputedStyle(name.parentElement);
    var room = name.parentElement.clientWidth - parseFloat(box.paddingLeft) - parseFloat(box.paddingRight);
    var size = Math.min((base * room) / natural, 420);
    name.style.fontSize = size.toFixed(1) + "px";
    /* ...unless that pushes the first screen past the window: then shrink
       by exactly the overflow (the name's line is a fixed share of its font
       size). Phones scroll, so they keep the width fit. */
    if (!wide.matches) return;
    var over = hero.offsetHeight - window.innerHeight;
    if (over > 0) {
      var share = parseFloat(window.getComputedStyle(name).lineHeight) / size || 0.8;
      size = Math.max(size - over / share, base * 0.6);
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

  /* ---------- 6. Buttons that lean in ---------- */

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-magnet]"), function (el) {
      el.addEventListener("pointermove", function (event) {
        if (reduced.matches) return;
        var box = el.getBoundingClientRect();
        var dx = (event.clientX - (box.left + box.width / 2)) / box.width;
        var dy = (event.clientY - (box.top + box.height / 2)) / box.height;
        el.style.translate = (dx * 8).toFixed(1) + "px " + (dy * 6).toFixed(1) + "px";
      });
      el.addEventListener("pointerleave", function () {
        el.style.translate = "";
      });
    });
  }

  /* ---------- 7. Rising in, and the light on cards ---------- */

  var reveals = document.querySelectorAll("[data-reveal]");
  var showAll = function () {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-in");
    });
  };
  if (reduced.matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var seen = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          seen.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );
    Array.prototype.forEach.call(reveals, function (el) {
      seen.observe(el);
    });
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener(
      "pointermove",
      function (event) {
        var card = event.target && event.target.closest ? event.target.closest("[data-spot]") : null;
        if (!card) return;
        var box = card.getBoundingClientRect();
        card.style.setProperty("--mx", (event.clientX - box.left).toFixed(0) + "px");
        card.style.setProperty("--my", (event.clientY - box.top).toFixed(0) + "px");
      },
      { passive: true }
    );
  }

  /* The Discord widget follows the theme switch. */
  var widgets = document.querySelectorAll('iframe[src*="discord.com/widget"]');
  if (widgets.length) {
    var syncWidgets = function () {
      var theme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      Array.prototype.forEach.call(widgets, function (frame) {
        var src = frame.getAttribute("src");
        var next = src.replace(/theme=(dark|light)/, "theme=" + theme);
        if (next !== src) frame.setAttribute("src", next);
      });
    };
    syncWidgets();
    if ("MutationObserver" in window) {
      new MutationObserver(syncWidgets).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  /* The top bar's backdrop, once the page has scrolled. */
  var bar = document.querySelector(".top");
  if (bar) {
    var mark = function () {
      bar.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", mark, { passive: true });
    mark();
  }

  /* ---------- 8. TikTok, when it comes near ---------- */

  var tiktok = document.querySelector("[data-tiktok]");
  var loadTikTok = function () {
    var script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  };
  if (tiktok) {
    if ("IntersectionObserver" in window) {
      var near = new IntersectionObserver(
        function (entries) {
          if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
          near.disconnect();
          loadTikTok();
        },
        { rootMargin: "800px 0px" }
      );
      near.observe(tiktok);
    } else {
      loadTikTok();
    }
  }
})();
