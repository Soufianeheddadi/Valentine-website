/* =============================================
   Valentine Website — script.js
   ============================================= */

// ── DOM refs ───────────────────────────────
const bunny   = document.getElementById('bunny');
const bubble  = document.getElementById('bubble');
const yesBtn  = document.getElementById('yesBtn');
const noBtn   = document.getElementById('noBtn');
const winEl   = document.getElementById('win');
const bgEl    = document.getElementById('bg');

// ── State ──────────────────────────────────
let noCount   = 0;          // how many times No has been clicked
let yesScale  = 1;          // current scale of Yes button
let noScale   = 1;          // current scale of No button
let phase     = 'happy';    // 'happy' | 'angry' | 'both-yes'

// ── Bunny smooth follow (lerp) ─────────────
let bx = window.innerWidth  / 2;
let by = window.innerHeight / 2;
let mx = window.innerWidth  / 2;
let my = window.innerHeight / 2;

document.addEventListener('mousemove', function (e) {
  mx = e.clientX;
  my = e.clientY;
  if (phase === 'angry') checkEscape(e);
});

(function animateBunny() {
  bx += (mx - bx) * 0.09;
  by += (my - by) * 0.09;
  bunny.style.left = bx + 'px';
  bunny.style.top  = by + 'px';

  if (phase === 'angry') updatePointingArm();

  requestAnimationFrame(animateBunny);
}());

// ── Point arm toward Yes button ────────────
function updatePointingArm() {
  var yesRect = yesBtn.getBoundingClientRect();
  var yesCx   = yesRect.left + yesRect.width  / 2;
  var yesCy   = yesRect.top  + yesRect.height / 2;

  // Bunny body approx center (bunny rendered above cursor via CSS transform)
  var bodyX = bx;
  var bodyY = by - 110; // mid-body offset

  var angle = Math.atan2(yesCy - bodyY, yesCx - bodyX) * 180 / Math.PI;
  // The arm hangs DOWN at rotate(0). To point in direction `angle` (atan2 convention:
  // 0=right, 90=down, -90=up), the CSS rotation needed is (90 - angle).
  var cssRot = 90 - angle;
  document.getElementById('armL').style.transform = 'rotate(' + cssRot + 'deg)';
}

// ── Speech-bubble messages ─────────────────
var messages = [
  'Please say yes! 🥺',
  'Are you sure? 😢',
  'Pretty please?! 😭',
  'CLICK YES RIGHT NOW!! 😡',
  'I MEAN IT… 😤',
  'Fine… BOTH say YES now! 💖'
];

function updateBubble() {
  bubble.textContent = messages[Math.min(noCount, messages.length - 1)];
}

// ── No button — escape helpers ─────────────
var noFixed    = false;
var lastEscape = 0;

function makeNoFixed() {
  if (noFixed) return;
  var r = noBtn.getBoundingClientRect();
  noBtn.style.position = 'fixed';
  noBtn.style.margin   = '0';
  noBtn.style.left     = r.left + 'px';
  noBtn.style.top      = r.top  + 'px';
  noBtn.style.zIndex   = '500';
  noFixed = true;
}

function checkEscape(e) {
  var now = Date.now();
  if (now - lastEscape < 200) return; // throttle

  var r   = noBtn.getBoundingClientRect();
  var cx  = r.left + r.width  / 2;
  var cy  = r.top  + r.height / 2;
  var dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  if (dist < 110) {
    lastEscape = now;
    jumpNoAway();
  }
}

function jumpNoAway() {
  // Possible escape directions: left, right, up, up-left, up-right
  var dirs = [
    [-1,  0],
    [ 1,  0],
    [ 0, -1],
    [-1, -1],
    [ 1, -1],
    [-0.8, -0.6],
    [ 0.8, -0.6]
  ];

  var dir  = dirs[Math.floor(Math.random() * dirs.length)];
  var dist = 160 + Math.random() * 130;
  var r    = noBtn.getBoundingClientRect();

  var newX = r.left + dir[0] * dist;
  var newY = r.top  + dir[1] * dist;
  var pad  = 24;

  // Clamp to viewport
  newX = Math.max(pad, Math.min(window.innerWidth  - r.width  - pad, newX));
  newY = Math.max(pad, Math.min(window.innerHeight - r.height - pad, newY));

  noBtn.style.transition = 'left 0.18s ease, top 0.18s ease';
  noBtn.style.left = newX + 'px';
  noBtn.style.top  = newY + 'px';

  setTimeout(function () {
    noBtn.style.transition = '';
  }, 200);
}

// ── Handle No click ────────────────────────
function handleNo() {
  if (phase === 'both-yes') return;

  noCount++;
  updateBubble();

  // Scale Yes up, No down
  yesScale = Math.min(yesScale + 0.45, 3.5);
  noScale  = Math.max(noScale  - 0.16, 0.22);

  yesBtn.style.transform = 'scale(' + yesScale + ')';

  if (phase !== 'angry') {
    noBtn.style.transform = 'scale(' + noScale + ')';
  }

  if (noCount === 3) {
    goAngry();
    return;
  }

  // Any click on No while in angry/escape mode → both become Yes
  if (phase === 'angry') {
    goBothYes();
    return;
  }
}

// ── Angry phase ────────────────────────────
function goAngry() {
  phase = 'angry';
  bunny.classList.add('angry');
  bubble.textContent = 'CLICK YES RIGHT NOW!! 😡';

  // Switch No button to fixed positioning so it can escape freely
  makeNoFixed();
  noBtn.style.transform = 'scale(' + noScale + ')';
}

// ── Both-Yes phase ─────────────────────────
function goBothYes() {
  phase = 'both-yes';

  // Centre the No button near the middle-bottom of the viewport, away from the
  // large Yes button so both are visible.
  var vw  = window.innerWidth;
  var vh  = window.innerHeight;
  var bw  = noBtn.offsetWidth  || 140;
  var bh  = noBtn.offsetHeight || 56;
  var targetLeft = Math.max(20, (vw / 2) - bw / 2);
  var targetTop  = Math.min(vh - bh - 20, vh * 0.72);

  noBtn.style.transition = 'left 0.6s ease, top 0.6s ease, transform 0.6s ease';
  noBtn.style.left      = targetLeft + 'px';
  noBtn.style.top       = targetTop  + 'px';
  noBtn.style.transform = 'scale(1)';

  setTimeout(function () { noBtn.style.transition = ''; }, 700);

  // Turn No button into a second Yes button
  noBtn.textContent = 'Yes! 💖';
  noBtn.classList.remove('btn-no');
  noBtn.classList.add('btn-yes', 'turned-yes');
  noBtn.onclick = handleYes;

  // Bunny celebrates
  bunny.classList.remove('angry');
  bubble.textContent = 'Both say YES now! 💖💖';

  // Pulse Yes button
  yesBtn.classList.add('bouncing');
}

// ── Handle Yes click ───────────────────────
function handleYes() {
  winEl.classList.remove('hidden');
  // Small delay so display:none is removed before the opacity transition starts
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      winEl.classList.add('show');
    });
  });
  spawnConfetti();
  bubble.textContent = 'YAY!! 🎉💖';
  bunny.classList.remove('angry');
}

// ── Confetti explosion ─────────────────────
function spawnConfetti() {
  var container = document.getElementById('confetti');
  var colors = ['#ff4d8b', '#ff80ab', '#ffd6e7', '#c0003c', '#ff9ec8', '#fff', '#ffb347'];

  for (var i = 0; i < 50; i++) {
    (function (i) {
      var el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.background  = colors[Math.floor(Math.random() * colors.length)];
      el.style.left        = Math.random() * 100 + '%';
      el.style.top         = Math.random() * 30  + '%';
      el.style.width       = (6 + Math.random() * 8) + 'px';
      el.style.height      = el.style.width;
      el.style.animationDuration  = (0.8 + Math.random() * 1.2) + 's';
      el.style.animationDelay     = (Math.random() * 0.6) + 's';
      container.appendChild(el);
    }(i));
  }
}

// ── Floating hearts in background ─────────
(function spawnHearts() {
  var emojis = ['💕', '💖', '💗', '💓', '🌸', '✨', '💝'];

  function addHeart() {
    var el = document.createElement('div');
    el.className = 'heart-float';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left            = Math.random() * 100 + 'vw';
    el.style.fontSize        = (0.9 + Math.random() * 1.4) + 'rem';
    el.style.animationDuration = (6 + Math.random() * 8) + 's';
    el.style.animationDelay  = (Math.random() * 4) + 's';
    bgEl.appendChild(el);

    // Remove after animation to avoid DOM bloat
    var dur = (parseFloat(el.style.animationDuration) + parseFloat(el.style.animationDelay)) * 1000;
    setTimeout(function () { el.remove(); }, dur);
  }

  // Initial burst
  for (var i = 0; i < 20; i++) addHeart();
  // Keep adding
  setInterval(addHeart, 900);
}());
