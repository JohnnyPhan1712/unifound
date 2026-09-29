/* UniFound mockup runtime: icon sprite, state switcher, small interactions.
   Chỉ phục vụ mockup tĩnh — không phải code ứng dụng. */
(function () {
  "use strict";

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.3v.2"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.7v.2"/>',
    edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M4 4l16 16M10 5.7A9.9 9.9 0 0 1 12 5.5C18 5.5 21.5 12 21.5 12a17 17 0 0 1-2.9 3.7M6.3 7.3A16.3 16.3 0 0 0 2.5 12S6 18.5 12 18.5c1.4 0 2.7-.3 3.8-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    inbox: '<path d="M3.5 13.5 6 5.5h12l2.5 8V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    wallet: '<path d="M4 8.5V7a2 2 0 0 1 2-2h11.5v3.5"/><rect x="4" y="8.5" width="16.5" height="11" rx="2.5"/><circle cx="16.5" cy="14" r="1"/>',
    key: '<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14 9l2 2"/>',
    shirt: '<path d="M8.5 3.5 4 6l-1.5 4.5 3 1.2v8.8h13v-8.8l3-1.2L20 6l-4.5-2.5c-.5 1.5-1.9 2.5-3.5 2.5s-3-1-3.5-2.5z"/>',
    book: '<path d="M5 19.5v-15A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zm0 0A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6"/>',
    other: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.6"/>',
    lost: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8M10.5 8v3M10.5 13.2v.1"/>',
    found: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />',
    "hand-check": '<path d="m8 12.5 2.5 2.5L16 9.5"/><circle cx="12" cy="12" r="8.5"/>'
  };

  function injectSprite() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
    Object.keys(ICONS).forEach(function (k) {
      s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + "</symbol>";
    });
    s += '<symbol id="uf-mark" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#2d5bd7"/>' +
      '<path d="M12.5 11.5v9a7.5 7.5 0 0 0 15 0v-9" fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/>' +
      '<circle cx="20" cy="17.2" r="3.1" fill="#fff"/></symbol>';
    s += "</svg>";
    document.body.insertAdjacentHTML("afterbegin", s);
  }

  /* ---- State switcher: data-when="state=a|b role=x" ---- */
  var current = {};

  function readHash() {
    var out = {};
    location.hash.replace(/^#/, "").split("&").forEach(function (p) {
      var kv = p.split("=");
      if (kv[0] && kv[1]) out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
    });
    return out;
  }

  function matches(expr) {
    return expr.split("||").some(function (alt) { return matchesAll(alt); });
  }

  function matchesAll(expr) {
    return expr.trim().split(/\s+/).every(function (cond) {
      var kv = cond.split("=");
      var allowed = kv[1].split("|");
      var neg = kv[0].charAt(kv[0].length - 1) === "!";
      var key = neg ? kv[0].slice(0, -1) : kv[0];
      var hit = allowed.indexOf(current[key]) !== -1;
      return neg ? !hit : hit;
    });
  }

  function apply() {
    document.querySelectorAll("[data-when]").forEach(function (el) {
      el.hidden = !matches(el.getAttribute("data-when"));
    });
    document.querySelectorAll(".mk-group button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(current[b.dataset.dim] === b.dataset.val));
    });
    document.querySelectorAll("[data-set]").forEach(function (b) {
      var kv = b.getAttribute("data-set").split("=");
      if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", String(current[kv[0]] === kv[1]));
    });
    Object.keys(current).forEach(function (k) { document.body.dataset[k] = current[k]; });
    document.dispatchEvent(new CustomEvent("mk:change", { detail: current }));
  }

  function writeHash() {
    var h = Object.keys(current).map(function (k) { return k + "=" + current[k]; }).join("&");
    history.replaceState(null, "", "#" + h);
  }

  function setupSwitcher() {
    var groups = document.querySelectorAll(".mk-group");
    var fromHash = readHash();
    groups.forEach(function (g) {
      var dim = g.dataset.dim;
      var first = g.querySelector("button");
      current[dim] = fromHash[dim] || (first && first.dataset.val);
      g.querySelectorAll("button").forEach(function (b) {
        b.dataset.dim = dim;
        b.type = "button";
        b.addEventListener("click", function () {
          current[dim] = b.dataset.val;
          writeHash();
          apply();
        });
      });
    });
    document.querySelectorAll("[data-dim-default]").forEach(function (el) {
      var kv = el.getAttribute("data-dim-default").split("=");
      if (!(kv[0] in current)) current[kv[0]] = fromHash[kv[0]] || kv[1];
    });
    document.querySelectorAll("[data-set]").forEach(function (b) {
      b.addEventListener("click", function () {
        var kv = b.getAttribute("data-set").split("=");
        current[kv[0]] = kv[1];
        writeHash();
        apply();
      });
    });
    window.addEventListener("hashchange", function () {
      var h = readHash();
      Object.keys(h).forEach(function (k) { current[k] = h[k]; });
      apply();
    });
    apply();
  }

  /* ---- Account menu ---- */
  function setupMenus() {
    document.querySelectorAll("[data-menu]").forEach(function (btn) {
      var pop = document.getElementById(btn.getAttribute("aria-controls"));
      if (!pop) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = pop.hidden;
        pop.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (e) {
        if (!pop.hidden && !pop.contains(e.target)) { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !pop.hidden) { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); }
      });
    });
  }

  /* ---- Toggle groups (category strip, pick chips) ---- */
  function setupToggles() {
    document.querySelectorAll("[data-toggle-group]").forEach(function (g) {
      g.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
        });
      });
    });
  }

  /* ---- Tabs ---- */
  function setupTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabs = list.querySelectorAll('[role="tab"]');
      function select(t) {
        tabs.forEach(function (x) {
          var on = x === t;
          x.setAttribute("aria-selected", String(on));
          x.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(x.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { select(t); });
        t.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          var n = tabs[(i + d + tabs.length) % tabs.length];
          n.focus(); select(n);
        });
      });
    });
  }

  /* ---- Dialogs ---- */
  function setupDialogs() {
    document.querySelectorAll("[data-open-dialog]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = document.getElementById(b.getAttribute("data-open-dialog"));
        if (d && d.showModal) d.showModal();
      });
    });
    document.querySelectorAll("[data-close-dialog]").forEach(function (b) {
      b.addEventListener("click", function () { var d = b.closest("dialog"); if (d) d.close(); });
    });
  }

  /* ---- Character counters ---- */
  function setupCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var out = document.getElementById(el.getAttribute("data-count"));
      var max = Number(el.getAttribute("maxlength")) || Number(el.dataset.max);
      function upd() {
        if (!out) return;
        out.textContent = el.value.length + "/" + max;
        out.classList.toggle("over", el.value.length > max);
      }
      el.addEventListener("input", upd);
      upd();
    });
  }

  /* ---- Password visibility ---- */
  function setupPassword() {
    document.querySelectorAll("[data-pw-toggle]").forEach(function (b) {
      var input = document.getElementById(b.getAttribute("data-pw-toggle"));
      b.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        b.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
        b.querySelector("use").setAttribute("href", show ? "#i-eye-off" : "#i-eye");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectSprite();
    setupSwitcher();
    setupMenus();
    setupToggles();
    setupTabs();
    setupDialogs();
    setupCounters();
    setupPassword();
  });
})();
