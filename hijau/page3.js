(() => {
  // ====== CONFIG ======
  const MUSIC_VOLUME = 0.7;
  const MUSIC_START_AT = 0; // mulai dari detik ke-berapa (kalau mau lompat ke bagian reff)
  // ====================

  const $ = (s) => document.querySelector(s);
  const buzz = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

  /* ================= BUNGA BUKET (SVG) ================= */
  const STROKE = "rgba(45,106,94,.28)";
  const ring = (n, rx, ry, d, fill, stroke = STROKE) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<ellipse cx="0" cy="${d}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width=".6" transform="rotate(${(i * 360) / n})"/>`;
    }
    return s;
  };

  const HEADS = {
    sunflower: () =>
      ring(18, 5, 13, -24, "#f2d982") + ring(14, 4.5, 11, -20, "#fbe9a6") +
      `<circle r="14" fill="#8a6d3b"/><circle r="9" fill="#a3814a"/><circle r="3" fill="#6e532b"/>`,
    rose: () => // mawar versi lilac
      `<circle r="24" fill="#8f88c9"/>` + ring(6, 10, 13, -11, "#a9a2dd") +
      `<circle r="14" fill="#c3bdee"/>` +
      `<path d="M0 0c5-2 7 4 1 7-8 3-13-3-9-10 4-8 17-5 16 5" fill="none" stroke="#7a73b8" stroke-width="1.6" stroke-linecap="round"/>`,
    tulip: () => // tulip biru langit lembut
      `<path d="M-18 -4C-18 -26 -6 -34 0 -38C6 -34 18 -26 18 -4C18 10 8 16 0 16C-8 16 -18 10 -18 -4Z" fill="#8fb6e6"/>` +
      `<path d="M-18 -4C-18 -24 -8 -32 -2 -36C-4 -20 -4 0 0 16C-10 14 -18 8 -18 -4Z" fill="#78a2dc"/>` +
      `<path d="M18 -4C18 -24 8 -32 2 -36C4 -20 4 0 0 16C10 14 18 8 18 -4Z" fill="#b5d0f0"/>`,
    sakura: () => // sakura putih-lilac
      ring(5, 11, 15, -14, "#efeafc") +
      `<circle r="5" fill="#f2d982"/>` +
      [0, 72, 144, 216, 288].map((a) => `<line x1="0" y1="0" x2="0" y2="-12" stroke="#b9b2ea" stroke-width="1" transform="rotate(${a + 36})"/>`).join(""),
    daisy: () =>
      ring(14, 3.6, 13, -15, "#ffffff", "rgba(45,106,94,.4)") + `<circle r="8" fill="#f2d982"/><circle r="3" fill="#d8b955"/>`
  };
  const SCALE = { sunflower: 0.95, rose: 1.05, tulip: 1, sakura: 1.12, daisy: 1 };

  const FLOWERS = [
    { name: "Bunga Matahari", x: 150, y: 82, type: "sunflower",
      msg: "Kamu tuh kayak matahari. Ada kamu di sekitar, suasananya langsung jadi hangat dan cerah, bahkan di hari yang lagi mendung." },
    { name: "Mawar", x: 88, y: 132, type: "rose",
      msg: "Kamu cantik banget tapi ga pernah sok-sokan. Makin dilihat malah makin bikin betah, kayak mawar yang anggunnya natural." },
    { name: "Tulip", x: 212, y: 132, type: "tulip",
      msg: "Kalem, rapi, tapi anggunnya ngena banget. Kamu ga perlu berisik buat bikin orang ngelirik." },
    { name: "Sakura", x: 46, y: 200, type: "sakura",
      msg: "Lembut dan indah, bikin orang berhenti sebentar cuma buat ngeliatin. Kamu tuh kayak sakura yang bikin hati adem." },
    { name: "Daisy", x: 254, y: 200, type: "daisy",
      msg: "Polos, tulus, apa adanya. Senyum kamu manis kayak daisy kecil yang diem-diem bikin hari orang jadi lebih baik." }
  ];

  const bq = $("#bq");
  (function buildBouquet() {
    let s = `<defs>
      <radialGradient id="glow" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
      <linearGradient id="wrap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf3"/><stop offset="1" stop-color="#f2e3a0"/></linearGradient>
    </defs>
    <circle cx="150" cy="150" r="150" fill="url(#glow)"/>`;

    // batang + daun
    FLOWERS.forEach((f) => {
      const cx = (150 + f.x) / 2, cy = f.y + (300 - f.y) * 0.55;
      s += `<path d="M150 300 Q ${cx} ${cy} ${f.x} ${f.y + 26}" fill="none" stroke="#3fa98a" stroke-width="3.2" stroke-linecap="round"/>`;
      const lx = cx + (f.x > 150 ? 8 : -8), ly = cy - 12;
      s += `<ellipse cx="${lx}" cy="${ly}" rx="11" ry="5" fill="#5cc4a1" transform="rotate(${f.x > 150 ? -35 : 35} ${lx} ${ly})"/>`;
    });

    // kepala bunga (bisa dipencet)
    FLOWERS.forEach((f, i) => {
      s += `<g class="fl" tabindex="0" role="button" aria-label="${f.name}" data-i="${i}" transform="translate(${f.x} ${f.y})">
        <circle r="40" fill="transparent"/>
        <g class="sway"><g transform="scale(${SCALE[f.type]})">${HEADS[f.type]()}</g></g>
      </g>`;
    });

    // pembungkus
    s += `<path d="M86 252 L214 252 L178 346 L122 346Z" fill="url(#wrap)" stroke="rgba(45,106,94,.3)" stroke-width="1"/>
      <path d="M86 252 L150 290 L214 252" fill="none" stroke="rgba(45,106,94,.25)" stroke-width="1.2"/>
      <rect x="120" y="296" width="60" height="9" rx="4" fill="#8fdcc0"/>`;
    bq.innerHTML = s;
  })();

  const pc = $("#petalCard"), pcName = $("#pcName"), pcMsg = $("#pcMsg"), pcCount = $("#pcCount");
  const seen = new Set();
  function pickFlower(g) {
    const i = +g.dataset.i, f = FLOWERS[i];
    bq.querySelectorAll(".fl").forEach((n) => n.classList.remove("active"));
    g.classList.add("active", "seen");
    seen.add(i);
    buzz(12);
    pc.classList.add("swap");
    setTimeout(() => {
      pcName.textContent = f.name;
      pcMsg.textContent = f.msg;
      pc.classList.remove("swap");
    }, 300);
    pcCount.textContent = seen.size === FLOWERS.length
      ? "Semua bunganya udah dibuka, semuanya buat kamu 🤍"
      : `${seen.size} dari ${FLOWERS.length} bunga dibuka`;
    rain(8);
  }
  bq.addEventListener("click", (e) => { const g = e.target.closest(".fl"); if (g) pickFlower(g); });
  bq.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { const g = e.target.closest(".fl"); if (g) { e.preventDefault(); pickFlower(g); } }
  });

  /* ================= TOPLES KERTAS ================= */
  const NOTES = [
    "Kamu baik banget, damn.",
    "Kamu pinter banget. Aku tuh cuma bisa mtk, tapi kamu jago di semuanya, anjay.",
    "Kamu lucu. Pokoknya semuanya lucu deh.",
    "Semoga ga ilfeel bacanya hehehe.",
    "Kamu pendek, kan ya..?",
    "Pokoknya semuanya 🤓"
  ];
  const jar = $("#jar"), shakeBtn = $("#shake"), note = $("#note"), noteText = $("#noteText"), jarCount = $("#jarCount");
  let order = [], pos = 0, busy = false;

  function shuffle() {
    order = NOTES.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    pos = 0;
  }
  shuffle();

  function drawNote() {
    if (busy) return;
    busy = true;
    if (pos >= order.length) { shuffle(); }
    note.classList.remove("show");
    jar.classList.remove("shake");
    void jar.getBoundingClientRect();
    jar.classList.add("shake");
    buzz([30, 30, 30, 30, 30]);

    setTimeout(() => {
      jar.classList.remove("shake");
      noteText.textContent = NOTES[order[pos]];
      pos++;
      void note.offsetWidth;
      note.classList.add("show");
      jarCount.textContent = `${pos} / ${NOTES.length} kertas`;
      shakeBtn.textContent = pos >= NOTES.length ? "Kocok lagi dari awal" : "Kocok lagi";
      busy = false;
      setTimeout(() => note.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
    }, 850);
  }
  shakeBtn.addEventListener("click", drawNote);
  jar.addEventListener("click", drawNote);

  /* ================= NOTIF + PENUTUP ================= */
  const notif = $("#notif"), gate = $("#gate"), closing = $("#closing");
  let notifShown = false;

  // bunga kecil di notif
  $("#notifFlower").innerHTML =
    `<svg viewBox="-20 -20 40 40" width="18" height="18">${HEADS.sakura()}</svg>`;

  function openNotif() {
    notifShown = true;
    document.body.classList.add("lock");
    notif.classList.add("show");
    notif.setAttribute("aria-hidden", "false");
    buzz([40, 40, 80]);
  }
  new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting && !notifShown) {
        obs.disconnect();
        setTimeout(openNotif, 700);
      }
    });
  }, { threshold: 0.6 }).observe(gate);

  $("#notifClose").addEventListener("click", () => {
    notif.classList.remove("show");
    notif.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
    closing.classList.add("show");
    rain(60);
    setTimeout(() => closing.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  });
  $("#again").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ================= REVEAL & PROGRESS ================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  const bar = $("#bar");
  addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  /* ================= MUSIK ================= */
  const audio = $("#bgm"), musicBtn = $("#music"), hint = $("#musicHint");
  let userPaused = false, wasPlayingBeforeHide = false;

  audio.addEventListener("loadedmetadata", () => {
    if (MUSIC_START_AT > 0 && MUSIC_START_AT < audio.duration) audio.currentTime = MUSIC_START_AT;
  });

  function fadeIn() {
    audio.volume = 0;
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(MUSIC_VOLUME, v + 0.04);
      audio.volume = v;
      if (v >= MUSIC_VOLUME) clearInterval(t);
    }, 100);
  }
  async function playMusic() {
    try {
      audio.volume = 0;
      await audio.play();
      fadeIn();
      musicBtn.classList.add("on");
      hint.classList.remove("show");
      return true;
    } catch (e) {
      musicBtn.classList.remove("on");
      return false;
    }
  }
  function pauseMusic() { audio.pause(); musicBtn.classList.remove("on"); }

  playMusic().then((ok) => { if (!ok && !userPaused) setTimeout(() => hint.classList.add("show"), 800); });

  function firstGesture(e) {
    if (e.target.closest && e.target.closest("#music")) return;
    if (userPaused || !audio.paused) return;
    playMusic();
  }
  ["pointerup", "touchend", "keydown"].forEach((ev) => addEventListener(ev, firstGesture, { passive: true }));

  musicBtn.addEventListener("click", () => {
    if (audio.paused) { userPaused = false; playMusic(); }
    else { userPaused = true; pauseMusic(); }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { wasPlayingBeforeHide = !audio.paused; if (wasPlayingBeforeHide) audio.pause(); }
    else if (wasPlayingBeforeHide && !userPaused) audio.play().catch(() => {});
  });

  /* ================= BACKGROUND: BUNGA BERVARIASI JATUH ================= */
  const cv = $("#bg"), ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr, petals = [];

  // bentuk bunga kecil untuk background (tanpa pink/merah)
  const BG_SHAPES = {
    daisy:   (c) => ring(12, 3.2, 9, -10, c) + `<circle r="4.6" fill="#f2d982"/>`,
    blossom: (c) => ring(5, 7, 9.5, -9, c) + `<circle r="3.6" fill="#f2d982"/>`,
    bell:    (c) => ring(5, 5.2, 6.4, -7, c) + `<circle r="3" fill="#fff4bf"/>`,
    tulip:   (c) => `<path d="M-9 -1C-9 -12 -4 -16 0 -18C4 -16 9 -12 9 -1C9 7 4 10 0 10C-4 10 -9 7 -9 -1Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/>`,
    leaf:    (c) => `<path d="M0 -14C9 -8 9 6 0 14C-9 6 -9 -8 0 -14Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/><path d="M0 -12V12" stroke="rgba(255,255,255,.6)" stroke-width="1"/>`
  };
  const BG_DEFS = [
    ["daisy", "#ffffff"], ["daisy", "#fff4bf"],
    ["blossom", "#cfc9f3"], ["blossom", "#ffffff"], ["blossom", "#bfe6f2"],
    ["bell", "#a9d4ee"], ["bell", "#cfc9f3"],
    ["tulip", "#b9b2ea"], ["tulip", "#fff4bf"],
    ["leaf", "#6fcfae"], ["leaf", "#8fdcc0"]
  ];
  const IMGS = BG_DEFS.map(([type, color]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40" width="64" height="64">${BG_SHAPES[type](color)}</svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    return img;
  });

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
  }
  function newPetal(top) {
    return {
      x: Math.random() * W,
      y: top ? -30 * dpr - Math.random() * H * 0.6 : Math.random() * H,
      s: (Math.random() * 9 + 9) * dpr,       // setengah ukuran gambar
      vy: (Math.random() * 0.7 + 0.35) * dpr,
      vx: (Math.random() - 0.5) * 0.4 * dpr,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.03,
      ph: Math.random() * 6.28,
      a: Math.random() * 0.25 + 0.65,
      img: IMGS[(Math.random() * IMGS.length) | 0],
      temp: false
    };
  }
  function rain(n) {
    if (reduce) return;
    for (let i = 0; i < n; i++) { const p = newPetal(true); p.temp = true; petals.push(p); }
  }
  function init() {
    resize();
    const base = reduce ? 8 : Math.min(Math.max(Math.round((innerWidth * innerHeight) / 24000), 14), 26);
    petals = Array.from({ length: base }, () => newPetal(false));
  }
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.vy;
      p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.5 * dpr;
      p.rot += p.vr;
      if (p.y > H + 40 * dpr) {
        if (p.temp) { petals.splice(i, 1); continue; }
        Object.assign(p, newPetal(true));
      }
      if (!p.img.complete) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.drawImage(p.img, -p.s, -p.s, p.s * 2, p.s * 2);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  addEventListener("resize", resize);
  init();
  requestAnimationFrame(frame);
})();