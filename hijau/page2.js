(() => {
  // ====== CONFIG ======
  const NEXT_PAGE = "page3.html";
  const FLOWER_COUNT = 40;
  // ====================

  const gift = document.getElementById("gift");
  const lid = document.getElementById("lid");
  const beam = document.getElementById("beam");
  const flowers = document.getElementById("flowers");
  const flash = document.getElementById("flash");
  const caption = document.getElementById("caption");

  const buzz = (p) => { if (navigator.vibrate) navigator.vibrate(p); };
  let started = false;

  /* ========== BUNGA BERVARIASI (SVG string) ========== */
  const STROKE = "rgba(45,106,94,.3)";
  const ring = (n, rx, ry, d, fill) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<ellipse cx="0" cy="${d}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${STROKE}" stroke-width=".5" transform="rotate(${(i * 360) / n})"/>`;
    }
    return s;
  };

  const SHAPES = {
    daisy:     (c) => ring(12, 3.2, 9, -10, c) + `<circle r="4.6" fill="#f2d982" stroke="${STROKE}" stroke-width=".5"/>`,
    blossom:   (c) => ring(5, 7, 9.5, -9, c) + `<circle r="3.6" fill="#f2d982"/>`,
    bell:      (c) => ring(5, 5.2, 6.4, -7, c) + `<circle r="3" fill="#fff4bf"/>`,
    sunflower: (c) => ring(14, 2.6, 8, -11, c) + `<circle r="6" fill="#a88642"/><circle r="2.6" fill="#7d6130"/>`,
    tulip:     (c) =>
      `<path d="M-9 -1C-9 -12 -4 -16 0 -18C4 -16 9 -12 9 -1C9 7 4 10 0 10C-4 10 -9 7 -9 -1Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/>` +
      `<path d="M0 -18C-3 -10 -3 2 0 10C3 2 3 -10 0 -18Z" fill="#ffffff" fill-opacity=".35"/>`,
    leaf:      (c) =>
      `<path d="M0 -14C9 -8 9 6 0 14C-9 6 -9 -8 0 -14Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/>` +
      `<path d="M0 -12V12" stroke="rgba(255,255,255,.6)" stroke-width="1"/>`
  };

  // jenis + warna (semua senada mint, tanpa pink/merah)
  const DEFS = [
    ["daisy", "#ffffff"], ["daisy", "#fff4bf"],
    ["blossom", "#cfc9f3"], ["blossom", "#ffffff"], ["blossom", "#bfe6f2"],
    ["bell", "#a9d4ee"], ["bell", "#cfc9f3"],
    ["sunflower", "#f2d982"],
    ["tulip", "#b9b2ea"], ["tulip", "#fff4bf"], ["tulip", "#9fd3ea"],
    ["leaf", "#6fcfae"], ["leaf", "#8fdcc0"]
  ];

  function flowerSVG(type, color, size) {
    return `<svg viewBox="-20 -20 40 40" width="${size}" height="${size}">${SHAPES[type](color)}</svg>`;
  }

  function burst() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (let i = 0; i < FLOWER_COUNT; i++) {
      const [type, color] = DEFS[(Math.random() * DEFS.length) | 0];
      const el = document.createElement("span");
      el.className = "flower";
      const size = 22 + Math.random() * 30;
      el.innerHTML = flowerSVG(type, color, size);
      flowers.appendChild(el);

      const dx = (Math.random() - 0.5) * vw * 0.95;
      const up = vh * (0.22 + Math.random() * 0.38);
      const fall = vh * (0.12 + Math.random() * 0.28);
      const rot = (Math.random() - 0.5) * 780;
      const base = "translate(-50%,-50%)";

      el.animate(
        [
          { transform: `${base} translate(0,0) scale(.2) rotate(0deg)`, opacity: 0, offset: 0, easing: "cubic-bezier(.12,.8,.3,1)" },
          { transform: `${base} translate(${dx * 0.18}px,${-up * 0.25}px) scale(.7) rotate(${rot * 0.1}deg)`, opacity: 1, offset: 0.08, easing: "cubic-bezier(.12,.8,.3,1)" },
          { transform: `${base} translate(${dx * 0.65}px,${-up}px) scale(1) rotate(${rot * 0.55}deg)`, opacity: 1, offset: 0.45, easing: "ease-in" },
          { transform: `${base} translate(${dx}px,${-up + fall}px) scale(.9) rotate(${rot}deg)`, opacity: 0, offset: 1 }
        ],
        {
          duration: 2000 + Math.random() * 900,
          delay: Math.random() * 450,
          fill: "forwards"
        }
      );
    }
  }

  /* ========== URUTAN ANIMASI ========== */
  function openGift() {
    if (started) return;
    started = true;

    document.body.classList.add("opening");
    caption.textContent = "✨ Opening your gift… ✨";
    buzz(15);

    // 0ms: bergetar
    gift.classList.add("shake");

    // 900ms: tutup terbuka + cahaya
    setTimeout(() => {
      gift.classList.remove("shake");
      gift.classList.add("opened");
      lid.classList.add("open");
      beam.classList.add("on");
      buzz([40, 30, 80]);
    }, 900);

    // 1150ms: bunga meluncur
    setTimeout(burst, 1150);

    // 3000ms: flash terang
    setTimeout(() => flash.classList.add("on"), 3000);

    // 4100ms: halaman 3
    setTimeout(() => { window.location.href = NEXT_PAGE; }, 4100);
  }

  gift.addEventListener("click", openGift);

  /* ========== BACKGROUND: BUNGA BERVARIASI MELAYANG ========== */
  const cv = document.getElementById("bg");
  const ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr, items = [];

  const BG_DEFS = [
    ["daisy", "#ffffff"], ["daisy", "#fff4bf"],
    ["blossom", "#cfc9f3"], ["blossom", "#ffffff"], ["blossom", "#bfe6f2"],
    ["bell", "#a9d4ee"], ["bell", "#cfc9f3"],
    ["tulip", "#b9b2ea"], ["tulip", "#fff4bf"],
    ["leaf", "#6fcfae"], ["leaf", "#8fdcc0"]
  ];
  const IMGS = BG_DEFS.map(([type, color]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40" width="64" height="64">${SHAPES[type](color)}</svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    return img;
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr;
    H = cv.height = innerHeight * dpr;
  }

  function spawn(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -30 * dpr - Math.random() * H * 0.4,
      s: (Math.random() * 8 + 8) * dpr,
      vy: (Math.random() * 0.5 + 0.25) * dpr,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.025,
      ph: Math.random() * 6.28,
      a: Math.random() * 0.25 + 0.65,
      img: IMGS[(Math.random() * IMGS.length) | 0]
    };
  }

  function init() {
    resize();
    const n = reduce ? 8 : Math.min(Math.max(Math.round((innerWidth * innerHeight) / 26000), 12), 24);
    items = Array.from({ length: n }, () => spawn(true));
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      p.y += p.vy;
      p.x += p.vx + Math.sin(t / 1500 + p.ph) * 0.45 * dpr;
      p.rot += p.vr;
      if (p.y > H + 40 * dpr) items[i] = spawn(false);
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