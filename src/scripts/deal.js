/* The Black Friday offer, by the clock (the menu, the offer card, the bill,
   the closing). Pages are built with the price of the day they were built.
   This script runs the countdown to the real end of the offer (deal.json
   endsAt) and, when it ends, switches a page that is still open to the later
   price, so the page and the checkout never disagree. Nothing is made up.
     [data-count]          the countdown: days, hours, minutes, seconds
     [data-offer]          shown only while the offer runs
     data-deal="price"     $99, then $249
     data-deal="buy"       Buy Bridle for $99
     data-deal="line"      the price sentence in the closing panel
     data-deal="tag"       the words in the menu's price pill
   Also says why a checkout came back (?checkout=soon|error). */
import DEAL from '../data/deal.json';

var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
var all = function (sel) { return document.querySelectorAll(sel); };
var two = function (n) { return (n < 10 ? '0' : '') + n; };
var end = Date.parse(DEAL.endsAt), timer = 0;

function ended() {
	var price = money(DEAL.after);
	var words = { price: price, buy: 'Buy Bridle for ' + price, line: price + ' once.', tag: 'Price' };
	all('[data-deal]').forEach(function (n) { var v = words[n.getAttribute('data-deal')]; if (v) n.textContent = v; });
	all('[data-offer]').forEach(function (n) { n.hidden = true; });
}

function tick() {
	var ms = end - Date.now();
	if (ms <= 0) { clearInterval(timer); ended(); return; }
	var s = Math.floor(ms / 1000);
	all('[data-count]').forEach(function (box) {
		box.hidden = false;
		box.querySelector('[data-d]').textContent = two(Math.floor(s / 86400));
		box.querySelector('[data-h]').textContent = two(Math.floor(s / 3600) % 24);
		box.querySelector('[data-m]').textContent = two(Math.floor(s / 60) % 60);
		box.querySelector('[data-s]').textContent = two(s % 60);
	});
}

if (document.querySelector('[data-offer], [data-count]')) {
	tick();
	if (end > Date.now()) timer = setInterval(tick, 1000);
}

var why = new URLSearchParams(location.search).get('checkout');
var note = document.querySelector('[data-checkout-note]');
if (why && note) {
	note.textContent = { soon: 'Checkout opens soon. Please try again in a little while.', error: 'The checkout did not open. Please try again.' }[why] || '';
	note.hidden = !note.textContent;
}
