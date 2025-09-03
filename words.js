// Pixels per ASCII "cell" at design size (16px monospace)
const CELL_W = 8;    // approx char width at 16px; tweak if needed
const CELL_H = 16;   // line height at 16px

function getView(){
  // Provided by index.html's fit()
  return (window.__eyefrogView || { scale: 1, offX: 0, offY: 0 });
}

function ensureWordEl(id, text){
  let el = document.getElementById(id);
  if (!el){
    el = document.createElement('div');
    el.id = id;
    el.className = 'word';
    el.textContent = String(text).toUpperCase();
    document.getElementById('words').appendChild(el);
  }
  return el;
}

/**
 * Places each sticky word as an absolutely-positioned DOM element.
 * Fixed-size mode (36px): we do NOT scale the element, only its position.
 * If you want words to scale with the scene instead, set el.style.transform = `scale(scale)`.
 */
window.updateWordsOverlay = function updateWordsOverlay(){
  const wordsLayer = document.getElementById('words');
  if (!wordsLayer || !window.stickyWords) return;

  const { scale, offX, offY } = getView();

  for (const w of window.stickyWords){
    const id = `w-${w.row}-${w.col}-${w.text}`;
    const el = ensureWordEl(id, w.text);

    // Map row/col -> viewport px
    const leftPx = offX + (w.col * CELL_W * scale) + 300;  // shift right 50px
    const topPx  = offY + (w.row * CELL_H * scale);


    el.style.left = leftPx + 'px';
    el.style.top  = topPx + 'px';

    // Keep constant 36px size (do not scale the element)
    el.style.transform = 'none';

    // Or, to scale with the frog, use:
    // el.style.transform = `scale(${scale})`;
  }
};
