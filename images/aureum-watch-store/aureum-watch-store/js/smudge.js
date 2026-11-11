/* AUREUM – liquid smudge effect.
   A fixed, click-through canvas paints soft warm blobs along the pointer path.
   Blobs fade out; an SVG "goo" filter merges them into a flowing ink look.
   pointer-events:none + passive listeners mean clicking and scrolling are never blocked. */

(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SCALE = 0.5;               // render at half resolution for performance
  var MAX_POINTS = 90;
  var LIFE = 1400;               // ms a blob takes to fade away
  var RADIUS = 46;               // base blob radius (css px)
  var COLOUR = "185,154,132";    // Crème Brûlée

  // SVG filter that makes overlapping blobs melt together like liquid
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.innerHTML =
    '<defs><filter id="smudge-goo" x="-10%" y="-10%" width="120%" height="120%">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/>' +
    '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -5" result="goo"/>' +
    '<feGaussianBlur in="goo" stdDeviation="2"/>' +
    '</filter></defs>';
  document.body.appendChild(svg);

  var canvas = document.createElement("canvas");
  canvas.className = "smudge-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var points = [];
  var last = null;
  var running = false;
  var w = 0, h = 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.ceil(w * SCALE);
    canvas.height = Math.ceil(h * SCALE);
  }
  resize();
  window.addEventListener("resize", resize);

  function addPoint(x, y) {
    var now = performance.now();
    if (last) {
      var dx = x - last.x, dy = y - last.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) return;
      // interpolate so fast movement leaves a continuous trail
      var steps = Math.min(8, Math.floor(dist / 14));
      for (var i = 1; i <= steps; i++) {
        points.push({ x: last.x + (dx * i) / (steps + 1), y: last.y + (dy * i) / (steps + 1), t: now, speed: dist });
      }
      points.push({ x: x, y: y, t: now, speed: dist });
    } else {
      points.push({ x: x, y: y, t: now, speed: 0 });
    }
    last = { x: x, y: y };
    if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
    start();
  }

  function start() {
    if (running) return;
    running = true;
    canvas.classList.add("is-active");
    requestAnimationFrame(frame);
  }

  function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    var alive = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var age = (now - p.t) / LIFE;
      if (age >= 1) continue;
      alive.push(p);
      var ease = 1 - age;
      var speedBoost = Math.min(1.6, 1 + p.speed / 80);
      var r = (RADIUS * speedBoost * (0.55 + 0.45 * ease)) * SCALE;
      var x = p.x * SCALE, y = p.y * SCALE;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      var a = 0.55 * ease * ease;
      g.addColorStop(0, "rgba(" + COLOUR + "," + a + ")");
      g.addColorStop(0.6, "rgba(" + COLOUR + "," + a * 0.55 + ")");
      g.addColorStop(1, "rgba(" + COLOUR + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    points = alive;
    if (points.length) {
      requestAnimationFrame(frame);
    } else {
      running = false;
      last = null;
      canvas.classList.remove("is-active");
    }
  }

  // Mouse
  window.addEventListener("mousemove", function (e) { addPoint(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener("mouseleave", function () { last = null; });

  // Touch (passive so native scrolling is untouched)
  function touchHandler(e) {
    var t = e.touches && e.touches[0];
    if (t) addPoint(t.clientX, t.clientY);
  }
  window.addEventListener("touchstart", function (e) { last = null; touchHandler(e); }, { passive: true });
  window.addEventListener("touchmove", touchHandler, { passive: true });
  window.addEventListener("touchend", function () { last = null; }, { passive: true });
})();
