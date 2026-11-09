/* The cost slider (src/components/Cost.astro): recomputes each monthly total
   and bar from the prices in data-cost (src/data/cost.ts), on one scale. */
var money = function (v) { return '$' + (v < 10 && v % 1 ? v.toFixed(2) : Math.round(v).toLocaleString('en-US')); };
document.querySelectorAll('[data-cost]').forEach(function (box) {
	var d = JSON.parse(box.getAttribute('data-cost'));
	var input = box.querySelector('input[type=range]');
	var out = function (k, v) { box.querySelectorAll('[data-out="' + k + '"]').forEach(function (o) { o.textContent = v; }); };
	var costs = function (n) {
		var c = { bridle: Math.max(0, n - d.free) * d.per };
		d.rivals.forEach(function (r) { c[r.key] = d.people * r.seat + Math.max(0, n - r.included) * r.perAnswer; });
		return c;
	};
	var run = function () {
		var n = +input.value, c = costs(n), max = Math.max.apply(null, Object.keys(c).map(function (k) { return c[k]; }));
		out('n', n.toLocaleString('en-US'));
		Object.keys(c).forEach(function (k) {
			out(k, money(c[k]));
			var bar = box.querySelector('[data-bar="' + k + '"]');
			if (bar) bar.style.width = (c[k] / max * 100).toFixed(2) + '%';
		});
		input.style.setProperty('--fill', ((n - +input.min) / (+input.max - +input.min) * 100).toFixed(1) + '%');
	};
	input.addEventListener('input', run);
	run();
});
