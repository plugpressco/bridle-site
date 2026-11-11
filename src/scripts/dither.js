/* Dithered dot clouds (src/components/Dither.astro). A soft field made of a
   few sine waves, faded in from one edge, turned into dots with a 4x4 Bayer
   pattern, one canvas pixel per 3 CSS pixels (scaled up crisp). It drifts
   slowly while on screen; with reduced motion it is drawn once and stays. */
var CELL_DEFAULT = 3;
var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(function (n) { return (n + 0.5) / 16; });
// Ramps, low to high, in Bridle's one blue only (owner, 2026-11-11: "dont
// force color"): pale blue into brand blue on light panels; on the blue deal
// panel, a lighter blue into white.
var RAMPS = {
	warm: [[229, 237, 253], [200, 218, 251], [157, 188, 247], [106, 155, 242], [31, 99, 230]],
	night: [[63, 124, 236], [106, 155, 242], [157, 188, 247], [200, 218, 251], [255, 255, 255]],
	// The home hero's blue panel: the whole panel in dots, lighter blues on
	// Bridle blue (owner's pick 2026-11-11).
	panel: [[52, 116, 214], [60, 124, 224], [78, 139, 232], [104, 158, 238], [140, 182, 243]],
};
var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hash(x, y) { var h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }

function setup(cv) {
	var from = cv.getAttribute('data-from') || 'bottom';
	var ramp = RAMPS[cv.getAttribute('data-tone')] || RAMPS.warm;
	var CELL = +cv.getAttribute('data-cell') || CELL_DEFAULT;
	var ctx = cv.getContext('2d');
	var img = null, W = 0, H = 0, visible = false, raf = 0, last = 0, t = Math.random() * 100;
	function size() {
		W = Math.max(1, Math.ceil(cv.clientWidth / CELL));
		H = Math.max(1, Math.ceil(cv.clientHeight / CELL));
		cv.width = W; cv.height = H;
		img = ctx.createImageData(W, H);
	}
	function draw() {
		var d = img.data;
		for (var y = 0; y < H; y++) {
			for (var x = 0; x < W; x++) {
				var i = (y * W + x) * 4;
				var u = x / W, w = y / H;
				var edge = from === 'all' ? 0.8 : from === 'right' ? (u - 0.3) / 0.7 : (w - 0.3) / 0.7;
				edge = edge <= 0 ? 0 : Math.pow(Math.min(1, edge), 1.5);
				var side = from === 'all' ? 0.78 + 0.22 * Math.abs(u - 0.5) * 2 : from === 'right' ? 0.75 + 0.25 * w : 0.55 + 0.45 * u;
				var f = 0.55 + 0.22 * Math.sin(x * 0.045 + t * 0.5) * Math.cos(y * 0.07 - t * 0.35) + 0.23 * Math.sin((x + y * 0.6) * 0.022 + t * 0.25);
				var v = f * edge * side * 1.45;
				if (v <= BAYER[(y & 3) * 4 + (x & 3)]) { d[i + 3] = 0; continue; }
				var c = v > 0.95 ? ramp[4] : v > 0.8 ? ramp[3] : v > 0.64 ? ramp[2] : v > 0.47 ? ramp[1] : ramp[0];
				if (v > 0.6 && hash(x, y) < 0.03) c = ramp[4];
				d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
			}
		}
		ctx.putImageData(img, 0, 0);
	}
	function tick(now) {
		raf = 0;
		if (!visible) return;
		if (now - last > 80) { last = now; t += 0.06; draw(); }
		raf = requestAnimationFrame(tick);
	}
	size(); draw();
	if (still) return;
	new IntersectionObserver(function (e) {
		visible = e[0].isIntersecting;
		if (visible && !raf) raf = requestAnimationFrame(tick);
	}).observe(cv);
	var rt = 0;
	window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(); }, 150); });
}

document.querySelectorAll('canvas[data-dither]').forEach(setup);
