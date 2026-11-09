/* The dot kit: helpers, the dot-matrix faces and the halftone engine every
   picture on bridle.to is drawn with. One rAF loop drives every scene that is
   on screen; with reduced motion each scene draws one still frame. */
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
var icon = function (id) {
	var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), use = document.createElementNS(ns, 'use');
	svg.setAttribute('class', 'i'); svg.setAttribute('aria-hidden', 'true'); use.setAttribute('href', '#' + id); svg.appendChild(use); return svg;
};
var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
var smooth = function (a, b, v) { v = clamp((v - a) / (b - a), 0, 1); return v * v * (3 - 2 * v); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var pick = function (list) { return list[Math.random() * list.length | 0]; };
var hash = function (x, y) { var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
var noise = function (x, y) {
	var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
	var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
	var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
	return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
var bump = function (node) { node.classList.remove('tick'); void node.offsetWidth; node.classList.add('tick'); };

/* ── Dot-matrix faces: a 7x7 LED grid on a pastel disc (rebrand/BRAND.md) ── */
var FACES = {
	maya:  { h: 200, hair: '0:2-4 1:1-5', feat: '2:2,4 4:1,5 5:2-4' },
	tom:   { h: 35,  hair: '', feat: '1:2,4 2:2,4 5:3' },
	priya: { h: 325, hair: '0:1-5 1:0,6', feat: '2:2,4 4:2-4 5:1,5' },
	jonas: { h: 150, hair: '', feat: '2:1,2,4,5 5:2-4' },
	ana:   { h: 265, hair: '0:1-5 1:0,1,5,6', feat: '2:2,4 4:1,5 5:2-4' },
	sam:   { h: 15,  hair: '0:2-4', feat: '2:2,4 4:2-4 5:1,5' },
	leo:   { h: 95,  hair: '0:1-4 1:1', feat: '2:2,4 5:2-4' }
};
var cells = function (spec) {
	var on = {};
	spec.split(' ').filter(Boolean).forEach(function (part) {
		var rc = part.split(':'), r = +rc[0];
		rc[1].split(',').forEach(function (c) {
			var ab = c.split('-').map(Number);
			for (var i = ab[0]; i <= (ab[1] == null ? ab[0] : ab[1]); i++) on[r + ':' + i] = 1;
		});
	});
	return on;
};
var faceSVG = function (name) {
	var f = FACES[name], hair = cells(f.hair), feat = cells(f.feat), out = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="hsl(' + f.h + ' 70% 86%)"/>';
	for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) {
		if ((r === 0 || r === 6) && (c === 0 || c === 6)) continue;
		var k = r + ':' + c, x = (5.2 + 3.6 * c).toFixed(1), y = (5.2 + 3.6 * r).toFixed(1);
		out += feat[k] ? '<circle cx="' + x + '" cy="' + y + '" r="1.62" fill="hsl(' + f.h + ' 45% 16%)"/>'
			: hair[k] ? '<circle cx="' + x + '" cy="' + y + '" r="1.3" fill="hsl(' + f.h + ' 45% 44%)"/>'
			: '<circle cx="' + x + '" cy="' + y + '" r=".9" fill="hsl(' + f.h + ' 35% 45% / .16)"/>';
	}
	return out + '</svg>';
};
var setFace = function (node, name) { node.innerHTML = faceSVG(name); };

/* ── Dot engine ──
   A halftone grid. Every frame a scene stamps soft shapes into an intensity
   grid; each dot is drawn with a radius from its intensity and the colour of
   whatever stamped it hardest. One batched path per colour. */
function Dots(canvas, opts) {
	this.c = canvas;
	this.x = canvas.getContext('2d');
	this.o = opts;
	this.pal = opts.palette;
	this.lens = null;
	this.size();
}
Dots.prototype.size = function () {
	var r = this.c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
	var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
	this.w = w; this.h = h; this.dpr = dpr;
	this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
	var p = this.p = typeof this.o.pitch === 'function' ? this.o.pitch(w) : this.o.pitch;
	this.cols = Math.ceil(w / p) + 1; this.rows = Math.ceil(h / p) + 1;
	this.ox = (w - (this.cols - 1) * p) / 2; this.oy = (h - (this.rows - 1) * p) / 2;
	var n = this.cols * this.rows;
	this.I = new Float32Array(n); this.C = new Uint8Array(n); this.M = new Float32Array(n).fill(1);
	this.rMin = this.o.rMin == null ? .8 : this.o.rMin; this.rMax = p * (this.o.fill || .44);
};
Dots.prototype.cx = function (i) { return this.ox + i * this.p; };
Dots.prototype.cy = function (j) { return this.oy + j * this.p; };
Dots.prototype.rowY = function (y) { return this.cy(Math.round((y - this.oy) / this.p)); };
Dots.prototype.clear = function () { this.I.fill(0); this.C.fill(0); };
// Anisotropic gaussian: centre, sigmas, peak, colour index.
Dots.prototype.stamp = function (x, y, sx, sy, amp, col) {
	var p = this.p, cols = this.cols, I = this.I, C = this.C;
	var i0 = Math.max(0, Math.floor((x - 3 * sx - this.ox) / p)), i1 = Math.min(cols - 1, Math.ceil((x + 3 * sx - this.ox) / p));
	var j0 = Math.max(0, Math.floor((y - 3 * sy - this.oy) / p)), j1 = Math.min(this.rows - 1, Math.ceil((y + 3 * sy - this.oy) / p));
	var ax = 1 / (2 * sx * sx), ay = 1 / (2 * sy * sy);
	for (var j = j0; j <= j1; j++) {
		var dy = this.oy + j * p - y, ey = dy * dy * ay, row = j * cols;
		if (ey > 4.6) continue;
		for (var i = i0; i <= i1; i++) {
			var dx = this.ox + i * p - x, v = amp * Math.exp(-(dx * dx * ax + ey));
			var k = row + i;
			if (v > I[k]) { I[k] = v; if (v > .05) C[k] = col; }
		}
	}
};
// Fill from a mask canvas sampled per dot (used for the mark).
Dots.prototype.sample = function (draw) {
	var off = document.createElement('canvas'); off.width = this.cols; off.height = this.rows;
	var g = off.getContext('2d');
	g.setTransform(1 / this.p, 0, 0, 1 / this.p, -this.ox / this.p + .5, -this.oy / this.p + .5);
	draw(g);
	var d = g.getImageData(0, 0, this.cols, this.rows).data, out = new Float32Array(this.cols * this.rows);
	for (var k = 0; k < out.length; k++) out[k] = d[k * 4 + 3] / 255;
	return out;
};
Dots.prototype.render = function () {
	var g = this.x, p = this.p, cols = this.cols, I = this.I, C = this.C, M = this.M, pal = this.pal;
	var rMin = this.rMin, span = this.rMax - this.rMin, L = this.lens;
	g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
	g.clearRect(0, 0, this.w, this.h);
	for (var c = 0; c < pal.length; c++) {
		g.beginPath();
		var any = false;
		for (var j = 0; j < this.rows; j++) {
			var y0 = this.oy + j * p, row = j * cols;
			for (var i = 0; i < cols; i++) {
				var k = row + i;
				if (C[k] !== c) continue;
				var v = I[k], x = this.ox + i * p, y = y0;
				if (L) {
					var dx = x - L.x, dy = y - L.y, d2 = dx * dx + dy * dy;
					if (d2 < L.r2) {
						var d = Math.sqrt(d2) || 1, f = 1 - d / L.r; f *= f;
						v += f * .34; x += dx / d * f * 7; y += dy / d * f * 7;
					}
				}
				var r = (rMin + span * Math.min(1, v)) * M[k];
				if (r < .45) continue;
				g.moveTo(x + r, y); g.arc(x, y, r, 0, 6.2832); any = true;
			}
		}
		if (any) { g.fillStyle = pal[c]; g.fill(); }
	}
};

/* One rAF loop drives every scene that is on screen. */
var scenes = [], raf = 0, last = 0;
var loop = function (now) {
	var dt = Math.min(.05, (now - last) / 1000 || 0); last = now; raf = 0;
	var live = false;
	scenes.forEach(function (s) { if (s.on) { s.tick(dt, now / 1000); live = true; } });
	if (live && !document.hidden) raf = requestAnimationFrame(loop);
};
var wake = function () { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } };
document.addEventListener('visibilitychange', wake);
var watch = function (scene, node) {
	scenes.push(scene);
	if (!('IntersectionObserver' in window)) { scene.on = true; return; }
	new IntersectionObserver(function (e) {
		scene.on = e[0].isIntersecting;
		if (scene.on && scene.enter) scene.enter();
		wake();
	}, { threshold: .05 }).observe(node);
};
var resizers = [];
var resizeT;
window.addEventListener('resize', function () {
	clearTimeout(resizeT);
	resizeT = setTimeout(function () { resizers.forEach(function (f) { f(); }); }, 150);
});

var MARK = new Path2D(document.querySelector('#mark path').getAttribute('d'));


/* Dots that settle into a shape: the closing card's mark, and the art on the
   inner pages. `shape(g)` fills a path in a 0..60 box; `palette` is
   [background dots, the shape, its soft edge]. */
var settle = function (box, art, opts) {
	var canvas = box.querySelector('canvas');
	if (!canvas) return;
	var dots = new Dots(canvas, { pitch: opts.pitch || function (w) { return w < 560 ? 8 : 10; }, palette: opts.palette, rMin: opts.rMin == null ? .9 : opts.rMin, fill: opts.fill || .43 });
	var shape = opts.shape || function (g) { g.fill(MARK, 'evenodd'); };
	var target, seed, start = -1, T = 0;
	var setup = function () {
		dots.size();
		var br = box.getBoundingClientRect(), ar = (art || box).getBoundingClientRect();
		var cx = ar.left - br.left + ar.width / 2, cy = ar.top - br.top + ar.height / 2;
		var d = Math.min(ar.width * (opts.scale || .82), ar.height * (opts.scale || .82), opts.max || 400);
		if (ar.width === 0 || ar.height === 0) { cx = br.width * .75; cy = br.height / 2; d = Math.min(br.height * .7, 380); }
		target = dots.sample(function (g) {
			g.translate(cx - d / 2, cy - d / 2); g.scale(d / 60, d / 60);
			g.fillStyle = '#000'; shape(g);
		});
		seed = new Float32Array(target.length);
		for (var k = 0; k < seed.length; k++) seed[k] = Math.random();
	};
	var frame = function (p) {
		var I = dots.I, C = dots.C, base = opts.base == null ? .03 : opts.base;
		for (var k = 0; k < I.length; k++) {
			var s = seed[k], local = smooth(s * .55, s * .55 + .45, p);
			var scatter = s > .93 ? .55 * (1 - local) : 0;
			var shimmer = .9 + .1 * Math.sin(T * 1.6 + s * 40);
			var v = target[k] * local * shimmer;
			var b = base + base * Math.sin(T * .7 + s * 12);
			if (v > scatter && v > b) { I[k] = v; C[k] = v > .5 ? 1 : 2; }
			else if (scatter > b) { I[k] = scatter; C[k] = 2; }
			else { I[k] = b; C[k] = 0; }
		}
		dots.render();
	};
	var scene = {
		on: false,
		enter: function () { if (start < 0) start = 0; },
		tick: function (dt) { T += dt; if (start >= 0) start += dt; frame(start < 0 ? 0 : Math.min(1, start / 1.8)); }
	};
	setup(); resizers.push(function () { setup(); frame(start < 0 ? 0 : Math.min(1, start / 1.8)); });
	if (reduce) { frame(1); return; }
	frame(0);
	watch(scene, box);
};

/* A still blue halftone wash that rises toward the bottom: the panel behind
   the product window and the chat demo. */
var wash = function (canvas) {
	var dots = new Dots(canvas, { pitch: 12, palette: ['#d9e5f7', '#a7c5f2', '#679eee'], rMin: .6, fill: .46 });
	var paint = function () {
		dots.size();
		dots.clear();
		var I = dots.I, C = dots.C, cols = dots.cols;
		for (var j = 0; j < dots.rows; j++) {
			var y = dots.cy(j) / dots.h;
			for (var i = 0; i < cols; i++) {
				var x = dots.cx(i) / dots.w;
				var n = .5 + .5 * Math.sin(x * 9.5 + y * 3) * Math.sin(y * 7 - x * 4);
				var v = Math.pow(smooth(.08, 1, y), 1.6) * (.55 + .45 * n) + .03;
				var k = j * cols + i;
				I[k] = v; C[k] = v > .55 ? 2 : v > .22 ? 1 : 0;
			}
		}
		dots.render();
	};
	paint(); resizers.push(paint);
};

export { reduce, el, icon, clamp, smooth, lerp, pick, hash, noise, bump, setFace, faceSVG, Dots, watch, wake, resizers, MARK, settle, wash };
