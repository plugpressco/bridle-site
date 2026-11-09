/* Bridle Pro's Black Friday deal, live (the home deal panel and /pricing/).
   Prices start at deal.json's first step and follow /api/deal once Polar
   answers. Counters show only real numbers: "left at this price" needs a
   live answer from /api/deal; "days left" comes from the deal's end. Nothing
   made up is ever shown. Also runs the 1 · 3 · 10 sites switch, the price
   steps chart and the buy buttons' labels and links. */
import DEAL from '../data/deal.json';

var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
var count = function (n) { return Number(n).toLocaleString('en-US'); };
var sitesLabel = function (n) { return n === 1 ? '1 site' : n + ' sites'; };
var all = function (sel) { return document.querySelectorAll(sel); };
var plan = function (key) { return DEAL.plans.find(function (p) { return p.key === String(key); }) || DEAL.plans[0]; };

var state = { step: 0, sites: DEAL.plans[0].key, live: null };
var priceOf = function (key, step) { return plan(key).base + DEAL.rise * (step == null ? state.step : step); };

function chart() {
	var box = document.querySelector('[data-chart]');
	if (!box) return;
	var p = plan(state.sites), last = DEAL.steps.length - 1, top = p.base + DEAL.rise * last;
	box.innerHTML = DEAL.steps.map(function (st, i) {
		var price = p.base + DEAL.rise * i, h = Math.round((price / top) * 220), now = i === state.step;
		return '<div class="col' + (now ? ' now' : '') + '">' + (now ? '<span class="here">You are here.</span>' : '') +
			'<span class="v">' + money(price) + '</span><i style="height:' + h + 'px"></i><span class="s">' + st.from + '–' + st.to + '</span></div>';
	}).join('');
	box.setAttribute('aria-label', 'Bridle Pro’s price goes up ' + money(DEAL.rise) + ' every 20 sales, from ' + money(p.base) + ' to ' + money(top) + ' for ' + sitesLabel(p.sites) + '. You are here: sales ' + DEAL.steps[state.step].from + ' to ' + DEAL.steps[state.step].to + '.');
}

function paint() {
	var p = plan(state.sites), price = priceOf(p.key), hasNext = state.step + 1 < DEAL.steps.length;
	all('[data-price]').forEach(function (n) { n.textContent = money(priceOf(n.getAttribute('data-price'))); });
	all('[data-sites]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-sites') === p.key)); });
	var set = function (k, v) { all('[data-pro="' + k + '"]').forEach(function (n) { n.textContent = v; }); };
	set('price', money(price));
	set('unit', 'pay once, for ' + sitesLabel(p.sites));
	set('answers', count(p.answers));
	set('next', money(price + DEAL.rise));
	set('next2', money(price + 2 * DEAL.rise));
	all('[data-pro-then]').forEach(function (n) { n.hidden = !hasNext; });
	all('[data-buy]').forEach(function (b) {
		var key = b.getAttribute('data-buy') === 'follow' ? p.key : b.getAttribute('data-buy');
		var label = (b.getAttribute('data-buy-label') || '').replace('{sites}', sitesLabel(plan(key).sites)).replace('{price}', money(priceOf(key)));
		b.setAttribute('href', '/api/checkout?plan=' + encodeURIComponent(key));
		if (b.firstChild && b.firstChild.nodeType === 3) b.firstChild.nodeValue = label + ' ';
	});
	all('[data-left-label]').forEach(function (n) { n.textContent = 'left at ' + money(priceOf(DEAL.plans[0].key)); });
	chart();
}

function counters() {
	var ms = Date.parse(DEAL.endsAt) - Date.now();
	var days = ms > 0 ? Math.max(1, Math.floor(ms / 86400000)) : 0;
	var live = state.live && state.live.state === 'open' ? state.live : null;
	all('[data-days]').forEach(function (n) { n.textContent = days; });
	all('[data-days-box]').forEach(function (n) { n.hidden = !days; });
	all('[data-left]').forEach(function (n) { n.textContent = live ? count(live.left) : ''; });
	all('[data-left-box], [data-pro-left]').forEach(function (n) { n.hidden = !live; });
	all('[data-prog]').forEach(function (n) {
		n.hidden = !live;
		if (live) {
			var size = live.to - live.from + 1;
			n.firstElementChild.style.width = Math.max(0, Math.min(100, ((size - live.left) / size) * 100)).toFixed(1) + '%';
		}
	});
	all('[data-counters]').forEach(function (n) { n.hidden = !days && !live; });
}

all('[data-sites]').forEach(function (b) {
	b.addEventListener('click', function () { state.sites = b.getAttribute('data-sites'); paint(); });
});

// The countdown to the deal's real end (deal.json endsAt), every second.
function countdown() {
	var ms = Date.parse(DEAL.endsAt) - Date.now();
	var two = function (n) { return (n < 10 ? '0' : '') + n; };
	all('[data-cd]').forEach(function (box) {
		box.hidden = ms <= 0;
		if (ms <= 0) return;
		var s = Math.floor(ms / 1000);
		box.querySelector('[data-cd-d]').textContent = two(Math.floor(s / 86400));
		box.querySelector('[data-cd-h]').textContent = two(Math.floor(s / 3600) % 24);
		box.querySelector('[data-cd-m]').textContent = two(Math.floor(s / 60) % 60);
		box.querySelector('[data-cd-s]').textContent = two(s % 60);
	});
}
if (document.querySelector('[data-cd]')) { countdown(); setInterval(countdown, 1000); }

if (document.querySelector('[data-price], [data-pro], [data-chart], [data-counters]')) {
	paint();
	counters();
	setInterval(counters, 60000);
	fetch('/api/deal', { headers: { Accept: 'application/json' } })
		.then(function (r) { return r.ok ? r.json() : null; })
		.then(function (d) {
			if (!d || !d.live) return;
			state.live = d;
			if (d.state === 'open') state.step = d.step;
			paint();
			counters();
		})
		.catch(function () {});
}
