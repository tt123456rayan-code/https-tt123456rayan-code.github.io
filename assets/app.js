/* ============================================================
   حصن — وكالة رقمية · Interactions Engine
   ============================================================ */
(function () {
  "use strict";

  /* ====== CONFIG — عدّل هون ====== */
  var CONFIG = {
    whatsapp: "962792669090",            // رقم واتساب الوكالة (بدون +)
    email: "info@hisnjo.tech",           // ← إيميل الاستقبال
    web3formsKey: ""                     // ← مفتاح Web3Forms (مجاني من web3forms.com) — إذا فاضي بيتحول النموذج لـ mailto
  };

  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var fine = window.matchMedia("(min-width:1020px) and (pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ====== nav scroll state + progress bar ====== */
  var nav = $("#nav"), prog = $("#progress");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    if (prog) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ====== mobile menu ====== */
  var burger = $("#burger");
  if (burger) {
    burger.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
    $$(".mobile a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* ====== active nav link ====== */
  var page = (location.pathname.split("/").pop() || "index.html");
  $$('.nav__links a, .mobile a').forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });

  /* ====== reveal on scroll ====== */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* ====== animated counters ====== */
  function animCount(el) {
    var target = parseFloat(el.dataset.count || "0"), dec = parseInt(el.dataset.dec || "0", 10),
        suf = el.dataset.suffix || "", pre = el.dataset.prefix || "", t0 = null, dur = 1700;
    if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });
  }

  /* ====== hero video autoplay rescue ====== */
  var v = $(".hero__media video");
  if (v) {
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    document.addEventListener("touchstart", function () { if (v.paused) v.play().catch(function () {}); }, { once: true, passive: true });
    document.addEventListener("click", function () { if (v.paused) v.play().catch(function () {}); }, { once: true });
  }

  /* ====== rotating typed words (hero) ====== */
  var swap = $(".swap");
  if (swap && !reduce) {
    var words = (swap.dataset.words || "").split("|").filter(Boolean);
    if (words.length) {
      var wi = 0, ci = 0, del = false;
      (function type() {
        var w = words[wi];
        swap.textContent = w.slice(0, ci);
        if (!del && ci < w.length) { ci++; setTimeout(type, 85); }
        else if (!del) { del = true; setTimeout(type, 1900); }
        else if (ci > 0) { ci--; setTimeout(type, 40); }
        else { del = false; wi = (wi + 1) % words.length; setTimeout(type, 350); }
      })();
    }
  } else if (swap) {
    swap.textContent = (swap.dataset.words || "").split("|")[0] || "";
  }

  /* ====== text scramble (eyebrow) ====== */
  var scr = $("[data-scramble]");
  if (scr && !reduce) {
    var fin = scr.getAttribute("data-scramble"), gl = "01<>/[]{}#$%&*+=ABCDEF0123456789", rv = 0;
    var iv = setInterval(function () {
      var o = "";
      for (var i = 0; i < fin.length; i++) o += (i < rv || fin[i] === " ") ? fin[i] : gl[Math.floor(Math.random() * gl.length)];
      scr.textContent = o; rv += 0.5;
      if (rv > fin.length) { clearInterval(iv); scr.textContent = fin; }
    }, 42);
  } else if (scr) { scr.textContent = scr.getAttribute("data-scramble"); }

  /* ====== FAQ accordion ====== */
  $$(".qa__q").forEach(function (b) {
    b.addEventListener("click", function () {
      var qa = b.parentElement, a = $(".qa__a", qa), open = qa.classList.contains("open");
      $$(".qa").forEach(function (x) { x.classList.remove("open"); var xa = $(".qa__a", x); if (xa) xa.style.maxHeight = null; });
      if (!open) { qa.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ====== pricing tabs ====== */
  var tabs = $$(".ptabs button");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
      $$(".ppanel").forEach(function (pn) { pn.classList.toggle("on", pn.id === t.dataset.panel); });
    });
  });

  /* ====== portfolio filters ====== */
  var fbtns = $$(".filters button");
  fbtns.forEach(function (f) {
    f.addEventListener("click", function () {
      fbtns.forEach(function (x) { x.classList.remove("on"); });
      f.classList.add("on");
      var cat = f.dataset.f;
      $$(".work").forEach(function (w) {
        w.classList.toggle("hide", cat !== "all" && w.dataset.cat !== cat);
      });
    });
  });

  /* ====== contact form ====== */
  var form = $("#cform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("#formMsg"), btn = $('button[type="submit"]', form);
      var data = new FormData(form);
      if (CONFIG.web3formsKey) {
        btn.disabled = true; btn.textContent = "جارٍ الإرسال…";
        data.append("access_key", CONFIG.web3formsKey);
        data.append("from_name", "موقع حصن");
        fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
          .then(function (r) { return r.json(); })
          .then(function (r) {
            msg.className = r.success ? "form-msg ok" : "form-msg err";
            msg.textContent = r.success ? "وصلنا طلبك ✓ — منرد عليك خلال 24 ساعة." : "صار خطأ — جرب واتساب أو الإيميل مباشرة.";
            if (r.success) form.reset();
          })
          .catch(function () { msg.className = "form-msg err"; msg.textContent = "تعذر الإرسال — تواصل معنا عبر واتساب."; })
          .finally(function () { btn.disabled = false; btn.textContent = "أرسل الطلب"; });
      } else {
        var subj = encodeURIComponent("طلب من موقع حصن — " + (data.get("name") || "زائر"));
        var body = encodeURIComponent(
          "الاسم: " + (data.get("name") || "") +
          "\nالجوال/واتساب: " + (data.get("phone") || "") +
          "\nالبريد: " + (data.get("email") || "") +
          "\nالخدمة: " + (data.get("service") || "") +
          "\n\n" + (data.get("msg") || "")
        );
        location.href = "mailto:" + CONFIG.email + "?subject=" + subj + "&body=" + body;
      }
    });
  }

  /* ====== interactive video players ====== */
  var players = $$(".vplayer");
  players.forEach(function (w) {
    var vd = $("video", w), btn = $(".vplay", w), mute = $(".vmute", w);
    if (!vd) return;
    function stopOthers() {
      players.forEach(function (o) { var ov = $("video", o); if (ov && ov !== vd) { ov.pause(); } });
    }
    function toggle() {
      if (vd.paused) { stopOthers(); vd.play().catch(function () {}); }
      else vd.pause();
    }
    if (btn) btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    vd.addEventListener("click", toggle);
    vd.addEventListener("play", function () { w.classList.add("playing"); });
    vd.addEventListener("pause", function () { w.classList.remove("playing"); });
    vd.addEventListener("ended", function () { w.classList.remove("playing"); vd.currentTime = 0; });
    if (mute) mute.addEventListener("click", function (e) {
      e.stopPropagation(); vd.muted = !vd.muted;
      mute.innerHTML = vd.muted
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    });
  });

  /* ====== whatsapp links ====== */
  $$("[data-wa]").forEach(function (a) {
    var text = encodeURIComponent(a.dataset.wa || "مرحبا، بدي أستفسر عن خدماتكم");
    a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + text;
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });

  /* ====== email links ====== */
  $$("[data-mail]").forEach(function (a) {
    a.href = "mailto:" + CONFIG.email;
    if (a.dataset.mail === "show") a.textContent = CONFIG.email;
  });

  /* ====== touch feedback (mobile) ====== */
  if (!fine) {
    $$(".card,.work,.price,.stepc").forEach(function (c) {
      c.addEventListener("touchstart", function () { c.style.transform = "scale(.985)"; }, { passive: true });
      c.addEventListener("touchend", function () { c.style.transform = ""; }, { passive: true });
    });
  }

  if (reduce) return;

  /* ====== constellation canvas (all devices; touch-aware) ====== */
  var cv = $("#bg-net");
  if (cv) {
    var ctx = cv.getContext("2d"), W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [], ripples = [], mouse = { x: -9999, y: -9999 };
    function resize() {
      W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      var n = Math.min(110, Math.floor(innerWidth / (fine ? 13 : 22)));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25 * DPR, vy: (Math.random() - .5) * .25 * DPR });
    }
    resize(); addEventListener("resize", resize);
    addEventListener("mousemove", function (e) { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; }, { passive: true });
    addEventListener("touchmove", function (e) { if (e.touches[0]) { mouse.x = e.touches[0].clientX * DPR; mouse.y = e.touches[0].clientY * DPR; } }, { passive: true });
    addEventListener("touchend", function () { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
    function addRipple(x, y) { ripples.push({ x: x * DPR, y: y * DPR, r: 0, max: 260 * DPR }); }
    addEventListener("click", function (e) { addRipple(e.clientX, e.clientY); });
    addEventListener("touchstart", function (e) { if (e.touches[0]) addRipple(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    var LINK = 140 * DPR, MR = 210 * DPR;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var ri = ripples.length - 1; ri >= 0; ri--) {
        var rp = ripples[ri]; rp.r += 6 * DPR;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, 6.283);
        ctx.strokeStyle = "rgba(54,214,255," + (.45 * (1 - rp.r / rp.max)) + ")"; ctx.lineWidth = 2 * DPR; ctx.stroke();
        if (rp.r >= rp.max) ripples.splice(ri, 1);
      }
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var dm = Math.hypot(p.x - mouse.x, p.y - mouse.y), e2 = dm < MR ? 1 - dm / MR : 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, (1.1 + e2 * 1.6) * DPR, 0, 6.283);
        ctx.fillStyle = "rgba(" + Math.round(91 + (54 - 91) * e2) + "," + Math.round(140 + (214 - 140) * e2) + ",255," + (.5 + e2 * .5) + ")";
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(91,140,255," + (.14 * (1 - d / LINK) + e2 * .12) + ")";
            ctx.lineWidth = DPR * .7; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  if (!fine) return;

  /* ====== cursor glow (desktop) ====== */
  var glow = $("#cursor-glow");
  if (glow) {
    var gmx = innerWidth / 2, gmy = innerHeight / 2, gx = gmx, gy = gmy;
    addEventListener("mousemove", function (e) { gmx = e.clientX; gmy = e.clientY; glow.style.opacity = 1; }, { passive: true });
    (function gl() { gx += (gmx - gx) * .14; gy += (gmy - gy) * .14; glow.style.transform = "translate(" + gx + "px," + gy + "px) translate(-50%,-50%)"; requestAnimationFrame(gl); })();
  }

  /* ====== hero parallax (desktop) ====== */
  var hero = $(".hero"), hm = $(".hero__media"), hc = $(".hero__in");
  if (hero && hm && hc) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect(), dx = (e.clientX - r.width / 2) / r.width, dy = (e.clientY - r.height / 2) / r.height;
      hm.style.transform = "translate(" + dx * -22 + "px," + dy * -22 + "px)";
      hc.style.transform = "translate(" + dx * 14 + "px," + dy * 10 + "px)";
    });
    hero.addEventListener("mouseleave", function () { hm.style.transform = ""; hc.style.transform = ""; });
  }

  /* ====== 3D tilt + spotlight (desktop) ====== */
  $$(".card,.work,.price").forEach(function (c) {
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.transform = "perspective(850px) rotateX(" + (py - .5) * -6 + "deg) rotateY(" + (px - .5) * 8 + "deg) translateY(-6px)";
      c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
    });
    c.addEventListener("mouseleave", function () { c.style.transform = ""; });
  });

  /* ====== magnetic buttons (desktop) ====== */
  $$(".btn").forEach(function (b) {
    b.addEventListener("mousemove", function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .18 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)";
    });
    b.addEventListener("mouseleave", function () { b.style.transform = ""; });
  });
})();
