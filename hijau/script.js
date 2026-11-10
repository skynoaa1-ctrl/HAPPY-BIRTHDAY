(() => {
  // ====== CONFIG ======
  const CODE = "1011";            // 10 November
  const NEXT_PAGE = "page2.html"; // halaman selanjutnya
  // ====================

  const card = document.getElementById("card");
  const dotsWrap = document.getElementById("dots");
  const dots = [...dotsWrap.children];
  const sub = card.querySelector(".sub");
  const SUB_DEFAULT = sub.textContent;

  let input = "";
  let locked = false;

  function render() {
    dots.forEach((d, i) => d.classList.toggle("on", i < input.length));
  }

  function buzz(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function press(key) {
    if (locked) return;

    if (key === "del") {
      input = input.slice(0, -1);
      render();
      return;
    }
    if (input.length >= 4) return;

    input += key;
    render();
    buzz(10);

    if (input.length === 4) {
      locked = true;
      setTimeout(check, 280);
    }
  }

  function check() {
    if (input === CODE) return success();

    // salah
    card.classList.add("wrong");
    dotsWrap.classList.add("wrong");
    buzz([60, 40, 60]);

    setTimeout(() => {
      input = "";
      render();
      card.classList.remove("wrong");
      dotsWrap.classList.remove("wrong");
      locked = false;
    }, 900);
  }

  function success() {
    card.classList.add("unlocked");
    sub.textContent = "Selamat datang, Abel 🤍";
    buzz([30, 50, 30, 50, 90]);

    setTimeout(() => document.body.classList.add("leaving"), 1500);
    setTimeout(() => { window.location.href = NEXT_PAGE; }, 2700);
  }

  // reset total (dipakai saat halaman dibuka lagi lewat back/refresh)
  function resetAll() {
    input = "";
    locked = false;
    render();
    card.classList.remove("unlocked", "wrong");
    dotsWrap.classList.remove("wrong");
    document.body.classList.remove("leaving");
    sub.textContent = SUB_DEFAULT;
  }

  // klik keypad
  document.getElementById("pad").addEventListener("click", (e) => {
    const btn = e.target.closest(".key");
    if (btn) press(btn.dataset.key);
  });

  // keyboard (laptop)
  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) {
      press(e.key);
      const btn = document.querySelector(`.key[data-key="${e.key}"]`);
      if (btn) {
        btn.classList.add("press");
        setTimeout(() => btn.classList.remove("press"), 140);
      }
    } else if (e.key === "Backspace") {
      press("del");
    }
  });

  // kalau halaman dipulihkan dari cache (tombol back), reset biar tombol hidup lagi
  addEventListener("pageshow", (e) => {
    if (e.persisted) resetAll();
  });

  /* ====== Background: bunga bervariasi melayang ====== */
  const cv = document.getElementById("bg");
  const ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr, items = [];

  const STROKE = "rgba(45,106,94,.3)";
  const ring = (n, rx, ry, d, fill) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<ellipse cx="0" cy="${d}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${STROKE}" stroke-width=".5" transform="rotate(${(i * 360) / n})"/>`;
    }
    return s;
  };
  const SHAPES = {
    daisy:   (c) => ring(12, 3.2, 9, -10, c) + `<circle r="4.6" fill="#f2d982"/>`,
    blossom: (c) => ring(5, 7, 9.5, -9, c) + `<circle r="3.6" fill="#f2d982"/>`,
    bell:    (c) => ring(5, 5.2, 6.4, -7, c) + `<circle r="3" fill="#fff4bf"/>`,
    tulip:   (c) => `<path d="M-9 -1C-9 -12 -4 -16 0 -18C4 -16 9 -12 9 -1C9 7 4 10 0 10C-4 10 -9 7 -9 -1Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/>`,
    leaf:    (c) => `<path d="M0 -14C9 -8 9 6 0 14C-9 6 -9 -8 0 -14Z" fill="${c}" stroke="${STROKE}" stroke-width=".6"/><path d="M0 -12V12" stroke="rgba(255,255,255,.6)" stroke-width="1"/>`
  };
  const DEFS = [
    ["daisy", "#ffffff"], ["daisy", "#fff4bf"],
    ["blossom", "#cfc9f3"], ["blossom", "#ffffff"], ["blossom", "#bfe6f2"],
    ["bell", "#a9d4ee"], ["bell", "#cfc9f3"],
    ["tulip", "#b9b2ea"], ["tulip", "#fff4bf"],
    ["leaf", "#6fcfae"], ["leaf", "#8fdcc0"]
  ];
  const IMGS = DEFS.map(([type, color]) => {
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