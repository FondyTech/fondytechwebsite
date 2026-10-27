/*!
 * FondyTech Lock Screen
 * Drop-in "under construction" password screen for any website.
 *
 * Usage (put it in <head>, before your other scripts):
 *   <script src="fondytech-lock.js" data-password-hash="PASTE_HASH_HERE"></script>
 *
 * Make a hash with make-password.html. Optional attributes:
 *   data-site="Client Name"   shows the site name on the lock screen
 *
 * NOTE: This keeps casual visitors out of a preview site. It is not real security:
 * the page files are still downloadable by anyone who knows how. Don't put secrets behind it.
 */
(function () {
  var script = document.currentScript;
  var HASH = ((script && script.getAttribute("data-password-hash")) || "").trim().toLowerCase();
  var SITE = (script && script.getAttribute("data-site")) || "";
  var KEY = "fondytech-unlock-" + HASH.slice(0, 16);

  function unlockedAlready() {
    try { if (localStorage.getItem(KEY) === "1") return true; } catch (e) {}
    try { if (sessionStorage.getItem(KEY) === "1") return true; } catch (e) {}
    return false;
  }
  if (!HASH || unlockedAlready()) return;

  // SHA-256 (works everywhere, including file:// and plain http)
  function sha256(str) {
    str = unescape(encodeURIComponent(str));
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, maxWord = mp(2, 32), result = "", words = [], bitLen = str.length * 8;
    var hash = [], k = [], pc = 0, isC = {}, i, j;
    for (var c = 2; pc < 64; c++) {
      if (!isC[c]) {
        for (i = 0; i < 313; i += c) isC[i] = c;
        hash[pc] = (mp(c, 0.5) * maxWord) | 0;
        k[pc++] = (mp(c, 1 / 3) * maxWord) | 0;
      }
    }
    hash = hash.slice(0, 8);
    str += "\x80";
    while (str.length % 64 - 56) str += "\x00";
    for (i = 0; i < str.length; i++) { j = str.charCodeAt(i); words[i >> 2] |= j << ((3 - i) % 4) * 8; }
    words[words.length] = (bitLen / maxWord) | 0;
    words[words.length] = bitLen;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), old = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] +
          (w[i] = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash);
        hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? "0" : "") + b.toString(16); }
    return result;
  }
  window.FondyTechLockHash = function (pw) { return sha256("fondytech:" + pw); };

  // Hide the page right away so it never flashes before the lock appears
  var css =
    "html.ft-locked{overflow:hidden!important}" +
    "html.ft-locked body>*:not(#ft-lock){visibility:hidden!important}" +
    "#ft-lock,#ft-lock *{box-sizing:border-box;margin:0;padding:0;border:0;font:inherit;color:inherit;background:none;text-align:left;letter-spacing:normal;text-transform:none;line-height:1.5}" +
    "#ft-lock{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#141112;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;padding:24px max(16px,env(safe-area-inset-right)) 24px max(16px,env(safe-area-inset-left));overflow:auto}" +
    "#ft-lock .ft-stripe{position:absolute;left:0;right:0;top:0;height:6px;background:#C41E3A}" +
    "#ft-lock .ft-card{width:100%;max-width:420px;display:flex;flex-direction:column;gap:18px}" +
    "#ft-lock .ft-brand{display:flex;align-items:center;gap:10px}" +
    "#ft-lock .ft-brand svg{width:40px;height:40px;flex:none}" +
    "#ft-lock .ft-word{font-weight:900;font-size:22px;letter-spacing:.03em;line-height:1}" +
    "#ft-lock .ft-word b{color:#E3364F;font-weight:900}" +
    "#ft-lock .ft-tag{display:inline-block;align-self:flex-start;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#E3364F;border:1.5px solid #E3364F;border-radius:3px;padding:3px 8px}" +
    "#ft-lock h1{font-size:28px;font-weight:800;line-height:1.15}" +
    "#ft-lock .ft-site{color:#BDB4B6;font-size:15px}" +
    "#ft-lock .ft-note{color:#BDB4B6;font-size:15px}" +
    "#ft-lock form{display:flex;flex-direction:column;gap:10px;margin-top:4px}" +
    "#ft-lock label{font-size:14px;font-weight:600;color:#fff}" +
    "#ft-lock .ft-row{display:flex;gap:8px}" +
    "#ft-lock input[type=password]{flex:1;min-width:0;background:#fff;color:#141112;border:2px solid #fff;border-radius:4px;padding:12px 14px;font-size:16px}" +
    "#ft-lock input[type=password]:focus{outline:none;border-color:#C41E3A;box-shadow:0 0 0 3px rgba(196,30,58,.45)}" +
    "#ft-lock button{background:#C41E3A;color:#fff;border-radius:4px;padding:12px 18px;font-weight:700;font-size:16px;cursor:pointer;white-space:nowrap}" +
    "#ft-lock button:hover{background:#8F1229}" +
    "#ft-lock button:focus-visible{outline:3px solid #fff;outline-offset:2px}" +
    "#ft-lock .ft-remember{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:400;color:#BDB4B6;cursor:pointer}" +
    "#ft-lock .ft-remember input{width:18px;height:18px;accent-color:#C41E3A}" +
    "#ft-lock .ft-err{color:#FF8A9A;font-size:14px;min-height:21px}" +
    "#ft-lock .ft-foot{margin-top:10px;padding-top:14px;border-top:1px solid #2F282A;color:#8E8587;font-size:13px}" +
    "#ft-lock .ft-shake{animation:ftshake .35s}" +
    "@keyframes ftshake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}" +
    "@media (prefers-reduced-motion:reduce){#ft-lock .ft-shake{animation:none}}";
  var style = document.createElement("style");
  style.id = "ft-lock-style";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  document.documentElement.classList.add("ft-locked");

  var cardinal =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 60 L12 34 L8 4 L22 14 L20 17.5 L32 19 L44 23.5 L47 38 C47 47 45 54 43 60 Z" fill="#C41E3A"/>' +
    '<path d="M33 21 L47 25 L47 38 L41 45 L33 34 Z" fill="#000"/><path d="M46 25 L60 31.5 L46 38 Z" fill="#8F1229"/><circle cx="40" cy="29" r="2.4" fill="#fff"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function build() {
    if (document.getElementById("ft-lock")) return;
    var box = document.createElement("div");
    box.id = "ft-lock";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "ft-lock-title");
    box.innerHTML =
      '<div class="ft-stripe"></div>' +
      '<div class="ft-card">' +
        '<div class="ft-brand">' + cardinal + '<span class="ft-word">FONDY<b>TECH</b></span></div>' +
        '<span class="ft-tag">Under construction</span>' +
        '<h1 id="ft-lock-title">This website is currently under construction by FondyTech.</h1>' +
        (SITE ? '<p class="ft-site">' + esc(SITE) + '</p>' : '') +
        '<p class="ft-note">Only authorized access allowed.</p>' +
        '<form id="ft-lock-form" novalidate>' +
          '<label for="ft-lock-pw">Password</label>' +
          '<div class="ft-row"><input type="password" id="ft-lock-pw" autocomplete="current-password" required>' +
          '<button type="submit">Unlock</button></div>' +
          '<label class="ft-remember"><input type="checkbox" id="ft-lock-remember" checked>Remember this device</label>' +
          '<p class="ft-err" id="ft-lock-err" role="alert"></p>' +
        '</form>' +
        '<p class="ft-foot">Built by FondyTech · Fond du Lac, Wisconsin · fondytech.com</p>' +
      '</div>';
    document.body.appendChild(box);

    var form = document.getElementById("ft-lock-form");
    var pw = document.getElementById("ft-lock-pw");
    var err = document.getElementById("ft-lock-err");
    var remember = document.getElementById("ft-lock-remember");
    pw.focus();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!pw.value) { err.textContent = "Enter the password."; pw.focus(); return; }
      if (sha256("fondytech:" + pw.value) === HASH) {
        try { (remember.checked ? localStorage : sessionStorage).setItem(KEY, "1"); } catch (x) {}
        box.parentNode.removeChild(box);
        document.documentElement.classList.remove("ft-locked");
        var st = document.getElementById("ft-lock-style");
        if (st) st.parentNode.removeChild(st);
      } else {
        err.textContent = "That password isn't right. Try again.";
        pw.value = "";
        var card = box.querySelector(".ft-card");
        card.classList.remove("ft-shake"); void card.offsetWidth; card.classList.add("ft-shake");
        pw.focus();
      }
    });
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);

  // To lock again: run FondyTechLock.reset() in the browser console
  window.FondyTechLock = {
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    }
  };
})();
