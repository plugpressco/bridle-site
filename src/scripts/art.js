/* The dot mountains (components/b/Art.astro): a mountain range drawn in small
   dots on a canvas, behind the hero and the closing panel. Printed like a
   halftone (owner picked the "Quiet" look, 12 November 2026): one ink, and the
   size of each dot carries the light, with a few orange dots on the slopes and
   along the ridge. A paler range stands behind, and a faint grid is the sky.
   Each canvas has its own seed, so every page gets its own skyline. Drawn once,
   and again when the window changes size; nothing moves. Decorative
   (aria-hidden). */
function hash2(x, y, s) { var h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vn(x, y, s) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); var a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, s) { return vn(x, y, s) * 0.55 + vn(x * 2.1, y * 2.1, s + 7) * 0.3 + vn(x * 4.3, y * 4.3, s + 13) * 0.15; }
function ridge(x, s) { return (1 - Math.abs(2 * vn(x, 0, s) - 1)) * 0.6 + (1 - Math.abs(2 * vn(x * 2.3, 5, s + 3) - 1)) * 0.28 + vn(x * 6, 9, s + 5) * 0.12; }
var INK = '#141414', ORANGE = '#ff4500', FAR = 'rgba(20,20,20,0.26)', SKY = 'rgba(20,20,20,0.07)';

function draw(cv) {
	var W = cv.clientWidth, H = cv.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
	if (!W || !H) return;
	cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
	var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
	var cell = +cv.getAttribute('data-cell') || 7, seed = +cv.getAttribute('data-seed') || 7, R = cell * 0.45;
	for (var row = 0, y = cell / 2; y < H + cell; y += cell, row++) {
		for (var col = 0, x = cell / 2; x < W + cell; x += cell, col++) {
			var u = x / 300;
			var yb = H - H * (0.34 + 0.58 * ridge(u * 0.75 + 3, seed + 11));
			var hf = H * (0.14 + 0.62 * ridge(u * 1.1, seed)), yf = H - hf;
			var ink = SKY, r = cell * 0.14, f = hash2(col, row, seed + 50);
			if (y >= yf) {
				// the front range: lit slopes get small dots, shaded slopes large ones
				var slope = ridge(u * 1.1 + 0.03, seed) - ridge(u * 1.1 - 0.03, seed);
				var L = fbm(x / 60 + y / 150, y / 34 - x / 170, seed + 20) + slope * 4.5 + ((y - yf) / hf) * 0.1;
				ink = INK; r = R * (L > 0.66 ? 0.3 : L > 0.53 ? 0.58 : 0.92);
				if (f < 0.03 || (y - yf < cell * 1.2 && f > 0.72)) { ink = ORANGE; r = R; }
			} else if (y >= yb) {
				// the range behind, paler
				var L2 = fbm(x / 80 + y / 200, y / 46, seed + 40);
				ink = FAR; r = R * (L2 > 0.6 ? 0.3 : L2 < 0.4 ? 0.66 : 0.46);
				if (f < 0.012) { ink = ORANGE; r = R * 0.8; }
			}
			c.fillStyle = ink; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
		}
	}
}

function all() { document.querySelectorAll('canvas[data-art]').forEach(draw); }
all();
var timer = 0, lastW = window.innerWidth;
window.addEventListener('resize', function () {
	// phones fire resize when the address bar hides; only a new width redraws
	if (window.innerWidth === lastW) return;
	lastW = window.innerWidth;
	clearTimeout(timer); timer = setTimeout(all, 150);
});
