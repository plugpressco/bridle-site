/* Waitlist forms (spacefast/functions/api/waitlist.ts).
   With a Turnstile site key on the form (src/data/site.ts), Turnstile runs on
   submit (execution: execute): the page asks it for a fresh token, sends it
   with how long the page has been open, and resets the widget after every
   attempt, since a token works once. Without a key the form posts without a
   token, and the function's other checks still apply. */
import { el, icon } from './kit.js';

var loadedAt = performance.now();
var params = new URLSearchParams(location.search);
var ref = [document.referrer, params.get('utm_source'), params.get('utm_campaign')].filter(Boolean).join(' | ').slice(0, 500);
window.bridleTurnstile = window.bridleTurnstile || [];

document.querySelectorAll('form.signup').forEach(function (form) {
	var box = form.closest('[data-form]');
	var msg = box.querySelector('.msg');
	var tsBox = box.querySelector('.ts');
	var sitekey = box.getAttribute('data-sitekey') || '';
	var widget = null, waiting = null;
	var done = function (fn, value) { if (waiting) { var w = waiting; waiting = null; w[fn](value); } };
	var render = function () {
		if (!sitekey || widget !== null || !window.turnstile) return;
		widget = window.turnstile.render(tsBox, {
			sitekey: sitekey,
			action: 'waitlist',
			appearance: 'interaction-only',
			execution: 'execute',
			callback: function (token) { done('resolve', token); },
			'error-callback': function () { done('reject', new Error('We could not check that you are a person. Please try again.')); },
			'expired-callback': function () { done('reject', new Error('That took a while. Please try again.')); }
		});
	};
	if (sitekey) { window.bridleTurnstile.push(render); render(); }
	var human = function () {
		if (!sitekey) return Promise.resolve('');
		return new Promise(function (resolve, reject) {
			render();
			if (widget === null) { reject(new Error('Still loading. Please try again in a moment.')); return; }
			waiting = { resolve: resolve, reject: reject };
			window.turnstile.execute(widget);
		});
	};
	form.querySelector('input[name=ref]').value = ref;
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var btn = form.querySelector('button');
		var data = Object.fromEntries(new FormData(form));
		btn.disabled = true;
		msg.className = 'msg';
		msg.textContent = '';
		human().then(function (token) {
			if (token) data['cf-turnstile-response'] = token;
			data.elapsed = Math.round(performance.now() - loadedAt);
			return fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				body: JSON.stringify(data)
			});
		}).then(function (r) {
			return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; });
		}).then(function (res) {
			if (!res.ok) throw new Error((res.j && res.j.error) || 'Something went wrong. Please try again.');
			var text = el('span');
			text.append('You’re on the list. We’ll email ', el('b', null, data.email), ' on launch day.');
			msg.replaceChildren(icon('i-check-circle'), text);
			box.classList.add('joined');
			var share = el('p', 'share');
			var copy = el('button', null, 'Copy the link');
			copy.type = 'button';
			copy.addEventListener('click', function () {
				if (navigator.clipboard) navigator.clipboard.writeText('https://bridle.to/').then(function () { copy.textContent = 'Link copied'; });
			});
			var post = el('a', null, 'post it on X');
			post.href = 'https://x.com/intent/post?text=' + encodeURIComponent('Bridle answers support email and website chat inside WordPress, from your own docs and replies. I just joined the waitlist:') + '&url=' + encodeURIComponent('https://bridle.to/');
			post.target = '_blank'; post.rel = 'noopener';
			share.append('Know someone drowning in support mail? ', copy, ' or ', post, '.');
			box.insertBefore(share, box.querySelector('.proof'));
		}).catch(function (err) {
			msg.className = 'msg err';
			msg.textContent = err && err.message && err.message !== 'Failed to fetch' ? err.message : 'Network error. Please try again.';
		}).finally(function () {
			btn.disabled = false;
			if (widget !== null && window.turnstile) window.turnstile.reset(widget);
		});
	});
});
