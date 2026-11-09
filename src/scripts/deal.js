// The live prices on every [data-deal] block. Asks /api/deal once; until
// Polar answers (no token yet, or an error) the cards keep the first prices
// from the build. Never shows a count Polar didn't give.
const blocks = document.querySelectorAll('[data-deal]');
const money = (n) => '$' + Number(n).toLocaleString('en-US');

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
	fetch('/api/deal', { headers: { Accept: 'application/json' } })
		.then((r) => r.json())
		.then((d) => {
			if (d && d.live) blocks.forEach((b) => paint(b, d));
		})
		.catch(() => {});
}
