/* The plugin's dot-matrix faces (bridle/src/app/components/ui/bridle-avatar.jsx),
   ported: a 7x7 LED grid on a pastel disc, picked from the seed, so a sender
   always gets the same face. Bridle itself is the blue bot with antennas. */
var MOD = 2147483647, NS = 'http://www.w3.org/2000/svg';
var hash32 = function (seed) { var h = 7919, s = String(seed || '').trim().toLowerCase(); for (var i = 0; i < s.length; i++) h = (h * 65599 + s.charCodeAt(i)) % MOD; return h || 1; };
var stream = function (seed) { var st = hash32(seed); var next = function () { st = (st * 48271) % MOD; return st; }; next(); return function (n) { return Math.floor((next() / MOD) * n); }; };
var HAIR = ['', '0:2-4', '0:2-4 1:1-5', '0:1-5 1:0,6', '0:1-5 1:0,1,5,6', '0:1-4 1:1', '0:2-5 1:5', '1:1-5'];
var EYES = ['2:2,4', '2:1,2,4,5', '1:2,4 2:2,4', '2:2,4 3:2,4', '2:1,5', '3:2,4'];
var MOUTHS = ['5:2-4', '4:1,5 5:2-4', '5:3', '4:2-4', '4:2-4 5:1,5', '4:3 5:2,4', '5:1-5'];
var cells = function (spec) {
	var on = {};
	String(spec || '').split(' ').filter(Boolean).forEach(function (part) {
		var p = part.split(':');
		p[1].split(',').forEach(function (col) { var r = col.split('-'); var a = +r[0], b = r.length > 1 ? +r[1] : a; for (var c = a; c <= b; c++) on[p[0] + ':' + c] = true; });
	});
	return on;
};
var draw = function (svg, bg, paint) {
	if (svg.childNodes.length) return;
	var c = document.createElementNS(NS, 'circle');
	c.setAttribute('cx', 16); c.setAttribute('cy', 16); c.setAttribute('r', 16); c.setAttribute('fill', bg);
	svg.appendChild(c);
	for (var r = 0; r < 7; r++) for (var k = 0; k < 7; k++) {
		if ((r === 0 || r === 6) && (k === 0 || k === 6)) continue;
		var d = paint(r + ':' + k), e = document.createElementNS(NS, 'circle');
		e.setAttribute('cx', (5.2 + 3.6 * k).toFixed(1)); e.setAttribute('cy', (5.2 + 3.6 * r).toFixed(1));
		e.setAttribute('r', d[0]); e.setAttribute('fill', d[1]); e.setAttribute('fill-opacity', d[2]);
		svg.appendChild(e);
	}
};
document.querySelectorAll('svg[data-seed]').forEach(function (svg) {
	var seed = svg.getAttribute('data-seed'), pick = stream(seed), hue = hash32(seed + ':hue') % 360;
	var hair = cells(HAIR[pick(HAIR.length)]), feat = cells(EYES[pick(EYES.length)] + ' ' + MOUTHS[pick(MOUTHS.length)]);
	draw(svg, 'hsl(' + hue + ' 70% 86%)', function (key) {
		if (feat[key]) return [1.62, 'hsl(' + hue + ' 45% 16%)', 1];
		if (hair[key]) return [1.3, 'hsl(' + hue + ' 45% 44%)', 1];
		return [0.9, 'hsl(' + hue + ' 35% 45%)', 0.16];
	});
});
var ANT = cells('0:1,5 1:1,5'), FEAT = cells('2:1,2,4,5 3:1,2,4,5 5:2-4');
document.querySelectorAll('svg[data-bot]').forEach(function (svg) {
	draw(svg, '#edf3fd', function (key) {
		if (FEAT[key]) return [1.62, '#2d6fcd', 1];
		if (ANT[key]) return [1.3, '#679eee', 1];
		return [0.9, '#2d6fcd', 0.14];
	});
});
