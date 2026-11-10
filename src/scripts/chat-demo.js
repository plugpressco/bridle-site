/* Bridle Chat, played: a visitor asks, the bubble answers with its source;
   then a refund question goes to a person, who will reply by email and in the
   bubble. Words are the plugin's own (Services\ChatWidget::config()). Runs
   only while on screen; with reduced motion it shows the finished chat. */
import { reduce, el } from './util.js';

document.querySelectorAll('[data-chatdemo]').forEach(function (box) {

	var log = box.querySelector('.bc-log'), form = box.querySelector('.bc-form');
	var input = box.querySelector('.bc-in'), btn = box.querySelector('.bc-btn');
	var comp = box.querySelector('.bc-comp span');
	var visible = false, PLACE = 'Ask a question…';
	var EMAIL = 'maya@lumen.studio';

	var gate = function () { return new Promise(function (res) { (function c() { if (visible && !document.hidden) res(); else setTimeout(c, 250); })(); }); };
	var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }).then(gate); };
	var scroll = function () { log.scrollTop = log.scrollHeight; };
	// Like the plugin's bubble (#142): answers sit beside the chat's face,
	// sources are numbered, and "looking it up" is three dots.
	var say = function (cls, text, from) {
		var m = el('div', 'bc-msg ' + cls);
		if (/thinking/.test(cls)) {
			m.append(el('i'), el('i'), el('i'));
		} else {
			m.appendChild(el('p', null, text));
		}
		if (from) {
			var s = el('div', 'bc-src');
			s.append(el('span', 'n', '1'), el('span', null, from));
			m.appendChild(s);
		}
		var node = m;
		if (/bot/.test(cls) && !/thinking/.test(cls)) {
			node = el('div', 'bc-turn');
			node.append(el('span', 'bc-ava sm', 'L'), m);
		}
		log.appendChild(node); scroll();
		return node;
	};
	var type = function (node, text, ms) {
		node.textContent = '';
		node.classList.add('on');
		return new Promise(function (resolve) {
			var i = 0;
			(function s() {
				node.textContent = text.slice(0, ++i);
				if (i < text.length) setTimeout(s, ms); else resolve();
			})();
		}).then(gate);
	};
	var thinking = function () { var t = say('bot thinking', 'Looking that up'); return t; };

	var ANSWER = 'Yes. Fernleaf Gallery works with WPML 4.6 and newer. Translate captions under WPML → String Translation.';
	var SENT = 'Thanks! We usually reply within 2 hours. You’ll see the reply here and at ' + EMAIL + '.';

	var still = function () {
		say('visitor', 'Does it work with WPML?');
		say('bot', ANSWER, 'Translating slides');
		say('visitor', 'Can I get a refund for last month?');
		say('bot', 'A person handles this kind of question.');
		say('note', SENT);
	};

	var play = function () {
		log.replaceChildren(); form.classList.remove('on'); input.textContent = ''; btn.classList.remove('press');
		comp.textContent = PLACE; comp.classList.remove('on');
		say('bot', 'Hi! Ask me anything. I answer from this site’s help pages, and a person can take over.');
		var t;
		return sleep(900)
			.then(function () { return type(comp, 'Does it work with WPML?', 45); })
			.then(function () { return sleep(350); })
			.then(function () { comp.textContent = PLACE; comp.classList.remove('on'); say('visitor', 'Does it work with WPML?'); return sleep(500); })
			.then(function () { t = thinking(); return sleep(1300); })
			.then(function () { t.remove(); say('bot', ANSWER, 'Translating slides'); return sleep(2600); })
			.then(function () { return type(comp, 'Can I get a refund for last month?', 40); })
			.then(function () { return sleep(350); })
			.then(function () { comp.textContent = PLACE; comp.classList.remove('on'); say('visitor', 'Can I get a refund for last month?'); return sleep(500); })
			.then(function () { t = thinking(); return sleep(1100); })
			.then(function () { t.remove(); say('bot', 'A person handles this kind of question.'); return sleep(700); })
			.then(function () { form.classList.add('on'); scroll(); return sleep(700); })
			.then(function () { return type(input, EMAIL, 55); })
			.then(function () { return sleep(400); })
			.then(function () { btn.classList.add('press'); return sleep(260); })
			.then(function () { form.classList.remove('on'); say('note', SENT); return sleep(5200); })
			.then(play);
	};

	if (reduce) { still(); return; }
	if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: .3 }).observe(box);
	else visible = true;
	gate().then(play);
});
