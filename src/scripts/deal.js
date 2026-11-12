/* The price of the moment (the menu, the price card, the bill, the closing).
   Bridle's price goes up as people buy: the steps in src/data/deal.json. Pages
   are built with the first step. This script asks /api/deal, which counts the
   paid orders on Polar, and moves the page to the real step, so the page and
   the checkout never disagree. Nothing is made up: when the count is not live
   (no answer, no Polar product yet) the page keeps what it was built with and
   shows no "left" number.
     data-deal="price"     $99, then $149, $199, $249
     data-deal="buy"       Buy Bridle for $99
     data-deal="rule"      $99 for the first 50 buyers. Then $149.
     data-deal="line"      the price sentence in the closing panel
     data-deal="tag"       the words in the menu's price pill
     [data-left]           "37 left", shown only with a live count
     [data-step="0"]       a cell of the steps row in the price card
     [data-offer]          shown only while a higher step is still to come
   Also says why a checkout came back (?checkout=soon|error). */
var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
var all = function (sel) { return document.querySelectorAll(sel); };
var put = function (sel, text) { all(sel).forEach(function (n) { n.textContent = text; }); };

function show(d) {
	var price = money(d.price), last = d.next === null;
	put('[data-deal="price"]', price);
	put('[data-deal="buy"]', 'Buy Bridle for ' + price);
	put('[data-deal="tag"]', last ? 'Price' : 'Launch price');
	put('[data-deal="line"]', last ? price + ' once.' : price + ' once for ' + d.left + ' more ' + (d.left === 1 ? 'buyer' : 'buyers') + '. Then ' + money(d.next) + '.');
	all('[data-offer]').forEach(function (n) { n.hidden = last; });
	if (last) return;
	put('[data-deal="rule"]', d.step === 0 ? price + ' for the first ' + d.to + ' buyers. Then ' + money(d.next) + '.' : price + ' until buyer ' + d.to + '. Then ' + money(d.next) + '.');
	all('[data-left]').forEach(function (n) { n.hidden = false; });
	put('[data-deal="left"]', d.left);
	all('[data-step]').forEach(function (cell) {
		var i = +cell.getAttribute('data-step'), note = cell.querySelector('[data-step-note]');
		cell.classList.toggle('is-done', i < d.step);
		cell.classList.toggle('is-now', i === d.step);
		if (cell.getAttribute('aria-current')) cell.removeAttribute('aria-current');
		if (i === d.step) cell.setAttribute('aria-current', 'step');
		if (note && i < d.step) note.textContent = 'sold out';
		if (note && i === d.step) note.textContent = d.left + ' left';
	});
}

if (document.querySelector('[data-deal], [data-step]')) {
	fetch('/api/deal', { headers: { Accept: 'application/json' } })
		.then(function (res) { return res.ok ? res.json() : null; })
		.then(function (d) { if (d && d.live && typeof d.step === 'number') show(d); })
		.catch(function () {});
}

var why = new URLSearchParams(location.search).get('checkout');
var note = document.querySelector('[data-checkout-note]');
if (why && note) {
	note.textContent = { soon: 'Checkout opens soon. Please try again in a little while.', error: 'The checkout did not open. Please try again.' }[why] || '';
	note.hidden = !note.textContent;
}
