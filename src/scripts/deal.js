// The live price on every [data-deal] card. Asks /api/deal once; until Polar
// answers (no Space variables yet, or an error) the cards keep the first
// step from the build. Never shows a count Polar didn't give.
const cards = document.querySelectorAll('[data-deal]');
const money = (n) => '$' + Number(n).toLocaleString('en-US');

function paint(card, d) {
  const set = (sel, text) => { const n = card.querySelector(sel); if (n) n.textContent = text; };
  const open = d.state === 'open';
  set('[data-deal-price]', money(d.price));
  set('[data-deal-left]', open ? `${d.left} left at ${money(d.price)}.` : 'Pay once is over.');
  set('[data-deal-next]', open ? (d.next ? `Then ${money(d.next)}.` : 'Then yearly.') : 'Pro is yearly now.');
  card.querySelectorAll('[data-step]').forEach((li) => {
    const price = Number(li.dataset.step);
    li.classList.toggle('now', open && price === d.price);
    li.classList.toggle('gone', price < d.price || !open);
  });
  const buy = card.querySelector('[data-deal-buy]');
  if (buy && card.dataset.open && open) buy.textContent = `Get Bridle Pro for ${money(d.price)}`;
}

if (cards.length) {
  fetch('/api/deal', { headers: { Accept: 'application/json' } })
    .then((r) => r.json())
    .then((d) => { if (d && d.live) cards.forEach((c) => paint(c, d)); })
    .catch(() => {});
}
