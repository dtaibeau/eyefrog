// DOM words overlay controller
// Expects main.js to define: window.__EYEFROG__ with { getStickyWords, getTransforms }
// - getStickyWords(): returns [{row, col, text}, ...] in ASCII cell coordinates
// - getTransforms(): returns { scale, offX, offY, CELL_W, CELL_H }

(() => {
  const wordsEl = document.getElementById('words');

  // Global horizontal push (kept from your 50px shift request)
  const GLOBAL_DX = 50;  // shift right by 50px
  const GLOBAL_DY = 0;

  // Scatter map (pixels) per word to avoid a straight line stack
  // Tweak these numbers anytime to reposition without touching the animation.
  const WORD_OFFSETS = {
    'NOTHING': { dx:  30, dy: -18 },
    'TO'     : { dx:  85, dy:  10 },
    'SEE'    : { dx:  10, dy:  34 },
    'HERE'   : { dx:  60, dy:  58 },
  };

  // Utility: ensure an element exists for each sticky word
  function ensureEl(id, label) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'word';
      el.id = id;
      el.dataset.w = label.toUpperCase();
      el.textContent = label.toUpperCase();
      wordsEl.appendChild(el);
    }
    return el;
  }

  // Called by main.js after each frame render
  function updateWordsOverlay() {
    if (!window.__EYEFROG__) return;

    const { getStickyWords, getTransforms } = window.__EYEFROG__;
    const stickyWords = getStickyWords();
    const { scale, offX, offY, CELL_W, CELL_H } = getTransforms();

    // Track which elements are used this frame
    const usedIds = new Set();

    for (const w of stickyWords) {
      const id = `word-${w.row}-${w.col}-${w.text}`;
      const label = String(w.text || '').toUpperCase();
      const el = ensureEl(id, label);
      usedIds.add(id);

      // Base position from ASCII grid → pixels
      let leftPx = offX + (w.col * CELL_W * scale);
      let topPx  = offY + (w.row * CELL_H * scale);

      // Apply global and per-word scatter offsets (in pixels, NOT scaled)
      const scatter = WORD_OFFSETS[label] || { dx: 0, dy: 0 };
      leftPx += GLOBAL_DX + scatter.dx;
      topPx  += GLOBAL_DY + scatter.dy;

      // Place
      el.style.left = `${leftPx}px`;
      el.style.top  = `${topPx}px`;
      el.style.opacity = '1';
      el.style.position = 'absolute';
    }

    // Hide/remove any stale word elements (not shown this loop)
    Array.from(wordsEl.children).forEach(node => {
      if (!usedIds.has(node.id)) {
        node.remove(); // remove instead of hide so they don't pile up
      }
    });
  }

  // Expose to main.js
  window.updateWordsOverlay = updateWordsOverlay;
})();
