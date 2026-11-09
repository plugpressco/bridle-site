// The live deal on every [data-deal] block: a calm countdown (days and
// hours, checked once a minute) and the prices from /api/deal. Until Polar
// answers (no token yet, or an error) the cards keep the first prices from
// the build. Never shows a count Polar didn't give.
const blocks = document.querySelectorAll('[data-deal]');
const money = (n) => '$' + Number(n).toLocaleString('en-US');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function left(endsAt, now = Date.now()) {
	const ms = Date.parse(endsAt) - now;
	if (!(ms > 0)) return '';
	const hours = Math.floor(ms / 3600000);
	const days = Math.floor(hours / 24);
	if (days > 0) return `${plural(days, 'day', 'days')}, ${plural(hours % 24, 'hour', 'hours')}`;
	return hours > 0 ? plural(hours, 'hour', 'hours') : 'under an hour';
}

function countdown(block) {
	const node = block.querySelector('[data-deal-ends]');
	if (!node || !block.dataset.ends) return;
	const time = left(block.dataset.ends);
	node.textContent = time ? `Black Friday deal ends in ${time}.` : 'The Black Friday deal has ended.';
}

function paint(block, d) {
	const set = (sel, text) => {
		const n = block.querySelector(sel);
		if (n) n.textContent = text;
	};
	const open = d.state === 'open';
	const last = !(d.plans || []).some((p) => p.next);
	set('[data-deal-left]', open ? `${d.left} left at these prices.` : 'Pay once is over.');
	set('[data-deal-next]', open ? (last ? 'Then yearly.' : `Then +${money(d.rise)}.`) : 'Pro is yearly now.');
	(d.plans || []).forEach((p) => {
		const card = block.querySelector(`[data-plan="${p.key}"]`);
		if (!card) return;
		const price = card.querySelector('[data-plan-price]');
		if (price) price.textContent = money(p.price);
		const buy = card.querySelector('[data-plan-buy]');
		if (buy && open) buy.textContent = `Get it for ${money(p.price)}`;
	});
}

if (blocks.length) {
	const tick = () => blocks.forEach(countdown);
	tick();
	setInterval(tick, 60000);
	fetch('/api/deal', { headers: { Accept: 'application/json' } })
		.then((r) => r.json())
		.then((d) => {
			if (d && d.live) blocks.forEach((b) => paint(b, d));
		})
		.catch(() => {});
}
