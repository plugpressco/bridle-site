/* The home page's moving pictures, from the approved v11 page (2026-10-06):
   the hero's dot field, the product window, three dot stories and the AI apps
   chat. Words moved to sentence case with the app. */
import { reduce, el, icon, clamp, smooth, lerp, pick, hash, noise, bump, setFace, Dots, watch, resizers, MARK, wash } from './kit.js';

/* ── Hero: tangled mail, the gate, three calm reins ── */
(function () {
	var hero = document.getElementById('hero'), band = document.getElementById('band');
	var gate = band.querySelector('.gate'), tip = band.querySelector('.tip');
	var lanesEl = band.querySelectorAll('.lane');
	var BASE = 0, BLUE = 1, DEEP = 2, GRAY = 3, AMBER = 4, INK = 5, HALO = 6;
	var dots = new Dots(hero.querySelector('canvas'), {
		pitch: function (w) { return w < 560 ? 9 : 11; },
		palette: ['#c9c9c3', '#679eee', '#2d6fcd', '#b4b4ae', '#f2b51d', '#181818', '#a7c5f2'],
		rMin: 0, fill: .46
	});
	var MAIL = {
		blue: [
			{ face: 'maya', name: 'Maya Chen', subj: 'Can I move my license to a new domain?' },
			{ face: 'jonas', name: 'Jonas Ortiz', subj: 'Where is my invoice for September?' },
			{ face: 'tom', name: 'Tom Becker', subj: 'Slider is blank on mobile' },
			{ face: 'ana', name: 'Ana Silva', subj: 'Does it work with WPML?' },
			{ face: 'leo', name: 'Leo Park', subj: 'Coupon code not applying at checkout' }
		],
		gray: [
			{ name: 'Stripe', subj: 'Your receipt from Stripe #1847', ic: 'i-receipt' },
			{ name: 'Growth Lab', subj: 'Quick question about your SEO', ic: 'i-news' },
			{ name: 'WP Weekly', subj: 'This week in WordPress, issue 212', ic: 'i-news' },
			{ name: 'crypto-deals', subj: 'You have (1) unclaimed reward', ic: 'i-ban' }
		],
		amber: [
			{ face: 'priya', name: 'Priya Nair', subj: 'Please refund order #1043' },
			{ face: 'sam', name: 'Sam Reid', subj: 'I was charged twice this month' }
		]
	};
	var KIND = {
		blue: { col: BLUE, lane: 0, status: 'Answered' },
		gray: { col: GRAY, lane: 2, status: 'Filed away' },
		amber: { col: AMBER, lane: 1, status: 'For you' }
	};
	var G = {}, packets = [], spawnIn = 0, pulse = 0, counts = [0, 0, 0], countEls = [];
	lanesEl.forEach(function (n) { countEls.push(n.querySelector('b')); });

	var layout = function () {
		dots.size();
		var hr = hero.getBoundingClientRect(), br = band.getBoundingClientRect();
		var w = dots.w, mobile = w < 560;
		var top = br.top - hr.top, bh = br.height;
		G.w = w; G.mobile = mobile;
		G.gx = Math.round(w * (mobile ? .5 : .43));
		G.gy = dots.rowY(top + bh * (mobile ? .5 : .52));
		G.top = top + 24; G.bot = top + bh - 18;
		G.gr = mobile ? 32 : 44;
		var gap = dots.p * (mobile ? 4 : 5);
		G.lanes = [G.gy - gap, G.gy, G.gy + gap];
		G.sendX = w * (mobile ? .84 : .74);
		G.labelX = w - (mobile ? 16 : 32);
		gate.style.transform = 'translate(' + G.gx + 'px,' + (G.gy - top) + 'px)';
		lanesEl.forEach(function (n, i) { n.style.top = (G.lanes[i] - top) + 'px'; });
		// Text stays clean: dots fade out around anything marked data-mask.
		var rects = [].map.call(hero.querySelectorAll('[data-mask]'), function (n) {
			var r = n.getBoundingClientRect();
			return [r.left - hr.left, r.top - hr.top, r.right - hr.left, r.bottom - hr.top];
		}).filter(function (r) { return r[2] - r[0] > 0; });
		for (var j = 0; j < dots.rows; j++) for (var i = 0; i < dots.cols; i++) {
			var x = dots.cx(i), y = dots.cy(j), m = 1;
			rects.forEach(function (r) {
				var dx = Math.max(r[0] - x, 0, x - r[2]), dy = Math.max(r[1] - y, 0, y - r[3]);
				m = Math.min(m, smooth(6, 46, Math.sqrt(dx * dx + dy * dy)));
			});
			dots.M[j * dots.cols + i] = m;
		}
		gate.classList.add('on');
		lanesEl.forEach(function (n) { n.classList.add('on'); });
	};

	var spawn = function (x) {
		var roll = Math.random(), kind = roll < .14 ? 'amber' : roll < .55 ? 'gray' : 'blue';
		var k = KIND[kind], mob = G.mobile;
		packets.push({
			kind: kind, col: k.col, lane: k.lane, mail: pick(MAIL[kind]),
			x: x == null ? -40 : x, y0: lerp(G.top + 20, G.bot - 20, Math.random()),
			sig: (mob ? 8 : 11) + Math.random() * (mob ? 5 : 7),
			v: (mob ? 30 : 46) + Math.random() * 36, ph: Math.random() * 6.28,
			fq: .5 + Math.random() * .9, amp: (mob ? 26 : 46) + Math.random() * 44,
			age: 0, a: 0, y: 0, sx: 0, sy: 0, done: false, counted: false, passed: false
		});
	};

	var step = function (dt, t) {
		spawnIn -= dt;
		if (spawnIn <= 0) { spawn(); spawnIn = (G.mobile ? .8 : .42) + Math.random() * .35; }
		var gx = G.gx, gy = G.gy;
		for (var n = packets.length - 1; n >= 0; n--) {
			var q = packets[n];
			q.age += dt;
			// Tangle → funnel: wander on two sines, then get drawn to the gate.
			var f = smooth(gx - (G.mobile ? 150 : 380), gx - 10, q.x);
			var u = smooth(gx + 14, gx + (G.mobile ? 90 : 210), q.x);
			var wob = Math.sin(t * q.fq + q.ph) * q.amp + Math.sin(t * q.fq * 2.3 + q.ph * 1.7) * q.amp * .35;
			var free = clamp(q.y0 + wob, G.top, G.bot);
			var laneY = G.lanes[q.lane];
			q.y = u > 0 ? lerp(gy, laneY, u * u * (3 - 2 * u)) : lerp(free, gy, f * f);
			var calm = q.kind === 'amber' ? 52 : 78;
			var speed = lerp(q.v * (1 + .55 * Math.sin(t * q.fq * 1.3 + q.ph)), calm, Math.max(f * .6, u));
			q.x += speed * dt;
			q.sx = lerp(q.sig, G.mobile ? 34 : 84, u);
			q.sy = lerp(q.sig, 4.4, u);
			q.a = Math.min(1, q.age * 1.5) * (.95 - .08 * u);
			// Swallowed by the gate, then let out as a rein.
			var inGate = Math.abs(q.x - gx) < G.gr * .9 ? 0 : 1;
			if (!q.passed && q.x > gx) { q.passed = true; pulse = 1; gate.classList.remove('pulse'); void gate.offsetWidth; gate.classList.add('pulse'); }
			q.vis = inGate;
			if (q.kind === 'blue' && q.x > G.sendX) q.col = INK;
			if (q.kind === 'gray') q.a *= 1 - smooth(G.sendX - 120, G.labelX - 40, q.x);
			if (!q.counted && q.x - q.sx > (q.kind === 'blue' ? G.sendX : G.labelX - 140)) {
				q.counted = true; counts[q.lane]++;
				countEls[q.lane].textContent = counts[q.lane]; bump(countEls[q.lane]);
			}
			if (q.x - q.sx * 3 > G.w + 20) packets.splice(n, 1);
		}
		pulse = Math.max(0, pulse - dt * 2.2);
	};

	var draw = function (t) {
		dots.clear();
		var I = dots.I, C = dots.C, cols = dots.cols;
		var gx = G.gx, gy = G.gy, edge = gx - G.gr * .6, half0 = (G.bot - G.top) / 2;
		var sc = G.mobile ? 1.5 : 1;
		for (var j = 0; j < dots.rows; j++) {
			var y = dots.cy(j), row = j * cols, haze = smooth(G.top - 240, G.top + 70, y);
			for (var i = 0; i < cols; i++) {
				var x = dots.cx(i), k = row + i;
				// Weather: a faint halftone haze that drifts above the band.
				var v = Math.max(0, noise(x * .006 * sc + t * .05, y * .009 * sc - t * .03) - .47) * .6 * haze, col = BASE;
				// The tangle: mail streaming through a funnel that narrows into the gate.
				if (x < edge) {
					var s = clamp(x / edge, 0, 1), half = lerp(half0, G.gr * .75, Math.pow(s, 1.25));
					var env = 1 - smooth(half * .4, half, Math.abs(y - gy));
					if (env > 0) {
						var n = noise(x * .02 * sc - t * 1.1, y * .026 * sc + t * .2) * .62 + noise(x * .05 * sc - t * 2.1, y * .06 * sc - t * .4) * .38;
						var d = clamp((n - .3) * 2.1, 0, 1) * env * (.6 + .4 * s);
						if (d > v) {
							v = d;
							var cn = noise(x * .011 * sc - t * .6 + 40, y * .016 * sc + 9);
							col = cn > .5 ? BLUE : cn < .18 ? AMBER : GRAY;
						}
					}
				}
				I[k] = v; C[k] = v > .05 ? col : BASE;
			}
		}
		// The reins: faint rails out of the gate, so the order is visible between mails.
		for (var l = 0; l < 3; l++) {
			var ry = Math.round((G.lanes[l] - dots.oy) / dots.p);
			if (ry < 0 || ry >= dots.rows) continue;
			for (var ii = 0; ii < cols; ii++) {
				var xx = dots.cx(ii);
				if (xx < G.gx + G.gr + 6) continue;
				var v = (.16 + .14 * Math.max(0, Math.sin(xx * .045 - t * 2.4 + l * 2))) * smooth(G.gx + G.gr, G.gx + G.gr + 140, xx), kk = ry * cols + ii;
				if (v > I[kk]) { I[kk] = v; C[kk] = BASE; }
			}
		}
		// Halo around the gate, brighter for a moment as each mail passes.
		var hr = G.gr + 16 + pulse * 10;
		for (var a = 0; a < 6.28; a += .2) dots.stamp(G.gx + Math.cos(a) * hr, G.gy + Math.sin(a) * hr, 3, 3, .2 + pulse * .35, HALO);
		packets.forEach(function (q) {
			if (!q.vis) return;
			dots.stamp(q.x, q.y, q.sx, q.sy, q.a, q.col);
			if (q.kind === 'blue' && q.col === BLUE && q.sx < 20) dots.stamp(q.x, q.y, q.sx * .45, q.sy * .45, q.a, DEEP);
		});
		dots.render();
	};

	var tick = function (dt, t) { step(dt, t); draw(t); };
	var scene = { tick: tick, on: false };

	// Hover a mail to read it.
	var showTip = function (q, mx, my) {
		if (!q) { tip.classList.remove('on'); return; }
		var m = q.mail, k = KIND[q.kind];
		if (tip.dataset.id !== m.subj) {
			tip.dataset.id = m.subj;
			var av;
			if (m.face) { av = el('span', 'face'); setFace(av, m.face); }
			else { av = el('span', 'bot'); av.appendChild(icon(m.ic)); }
			var txt = el('div'); txt.append(el('b', null, m.name), el('span', null, m.subj));
			var st = el('em', null, k.status); st.dataset.k = q.kind === 'amber' ? 'mine' : q.kind === 'gray' ? 'filed' : '';
			tip.replaceChildren(av, txt, st);
		}
		var br = band.getBoundingClientRect(), hr = hero.getBoundingClientRect();
		var tx = clamp(mx + 16, 8, br.width - tip.offsetWidth - 8), ty = my - (br.top - hr.top) - tip.offsetHeight - 16;
		tip.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
		tip.classList.add('on');
	};
	var point = function (e) {
		var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
		dots.lens = { x: x, y: y, r: 96, r2: 96 * 96 };
		var best = null, bd = 34 * 34;
		packets.forEach(function (q) {
			if (!q.vis) return;
			var dx = (x - q.x) / Math.max(1, q.sx / q.sig), dy = y - q.y, d = dx * dx + dy * dy;
			if (d < bd) { bd = d; best = q; }
		});
		showTip(best, x, y);
		if (reduce) draw(0);
	};
	hero.addEventListener('pointermove', point);
	hero.addEventListener('pointerdown', point);
	hero.addEventListener('pointerleave', function () { dots.lens = null; tip.classList.remove('on'); if (reduce) draw(0); });

	var start = function () {
		layout();
		// Pre-fill so the first frame is already mid-story, not empty.
		packets = []; spawnIn = 0;
		for (var s = 0; s < 22; s++) step(.5, s * .5);
		counts = [12, 2, 31];
		countEls.forEach(function (n, i) { n.textContent = counts[i]; });
		draw(11);
	};
	resizers.push(start);
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
	start();
	watch(scene, hero);
})();

/* ── Product window: the email, its draft, your send ── */
(function () {
	var panel = document.getElementById('panel');
	wash(panel.querySelector('canvas'));

	// Every source here is one Bridle really reads: a saved reply, a product, a help doc, a past answer.
	var MAIL = [
		{ face: 'maya', name: 'Maya Chen', from: 'maya@lumen.studio', subj: 'Can I move my license to a new domain?', body: "We're relaunching next week. Will the license move with us?",
			src: 'From your saved reply “Moving a license”', text: 'Hi Maya, yes, the license moves with you. Deactivate it under Settings → License on the old site, then activate the same key on the new domain. Nothing to buy.' },
		{ face: 'jonas', name: 'Jonas Ortiz', from: 'jonas@ortiz.dev', subj: 'Does the Pro plan include updates?', body: 'Thinking of upgrading. Do I get a year of updates with Pro?',
			src: 'From your product “Pro plan”', text: 'Hi Jonas, yes. Pro is $49 a year and includes every update and priority support for that year. You can upgrade any time from your account page.' },
		{ face: 'priya', name: 'Priya Nair', from: 'priya@nairandco.com', subj: 'Please refund order #1043', body: "It doesn't do what I needed. I'd like my money back.", mine: true,
			src: 'Refunds always wait for you', text: 'Refunds, billing and upset customers never go out on their own. Bridle marks this one for you and waits.' },
		{ face: 'tom', name: 'Tom Becker', from: 'tom@beckerbikes.de', subj: 'Slider is blank on mobile', body: 'Since the last update the slider shows nothing on my phone.', auto: true,
			src: 'From your docs “Safari display fix”', text: 'Hi Tom, thanks for the heads-up. Version 2.4.1 fixes this on Safari. Update from Plugins → Updates and clear your cache. Still blank? Send me the page URL.' },
		{ face: 'ana', name: 'Ana Silva', from: 'ana@silvadesign.pt', subj: 'Can I use it on a staging site?', body: 'We keep a staging copy of the store. Does it count as another site?',
			src: 'From how you answered this before', text: 'Hi Ana, staging is free. Use the same key on your staging copy; it won’t use up an activation.' },
		{ face: 'leo', name: 'Leo Park', from: 'leo@parkandco.io', subj: 'Can I move my settings to a new install?', body: 'Setting up a fresh site. Can I take my carousel settings with me?', by: 'Claude',
			src: 'Drafted by Claude, from your docs', text: 'Hi Leo, yes. Go to Settings → Tools → Export, download the file, then import it on the new site from the same screen.' }
	];
	var AGO = ['2m', '9m', '14m', '31m', '48m', '1h'];
	var rowsEl = document.getElementById('rows'), rows = [];
	MAIL.forEach(function (m, i) {
		var row = el('div', 'row'), av = el('span', 'face'), d = el('div'), b = el('b'), st = el('span', 'st');
		setFace(av, m.face);
		b.append(m.name, el('u', null, AGO[i]));
		d.append(b, el('span', null, m.subj), st);
		row.append(av, d);
		rowsEl.appendChild(row);
		rows.push({ row: row, st: st });
	});

	var th = document.getElementById('thread'), tin = th.querySelector('.tin');
	var $ = function (s) { return th.querySelector(s); };
	var chip = $('.chip'), send = $('.send'), t = $('.t'), rest = $('.rest');
	var imbox = document.getElementById('n-imbox'), left = MAIL.length;

	var visible = false;
	var gate = function () { return new Promise(function (res) { (function c() { if (visible && !document.hidden) res(); else setTimeout(c, 250); })(); }); };
	var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }).then(gate); };
	var setChip = function (kind, label, ic) {
		chip.setAttribute('data-k', kind);
		chip.replaceChildren();
		if (ic) chip.appendChild(icon(ic));
		chip.append(label);
		bump(chip);
	};
	var setRow = function (i, kind, label, ic) {
		var st = rows[i].st;
		st.dataset.k = kind; st.replaceChildren();
		if (ic) st.appendChild(icon(ic));
		if (label) st.append(label);
	};
	var fill = function (i) {
		var m = MAIL[i];
		rows.forEach(function (r, n) { r.row.classList.toggle('on', n === i); });
		th.setAttribute('data-s', 'new');
		setFace($('[data-face]'), m.face);
		$('.who b').textContent = m.name;
		$('.who small').textContent = m.from;
		$('.subj').textContent = m.subj;
		$('.body').textContent = m.body;
		$('.src').textContent = m.src;
		$('.lbl').replaceChildren(icon(m.mine ? 'i-lock' : 'i-sparkles'), m.mine ? 'Waits for you' : m.by ? m.by : 'Draft');
		t.textContent = '';
		rest.textContent = m.text;
		send.classList.remove('press');
		send.firstChild.textContent = 'Send';
		setChip('new', 'New');
	};
	var type = function (text) {
		th.classList.add('typing');
		return new Promise(function (resolve) {
			var i = 0;
			(function s() {
				if (!visible || document.hidden) { setTimeout(s, 250); return; }
				i = Math.min(text.length, i + 2 + (Math.random() * 2 | 0));
				t.textContent = text.slice(0, i);
				rest.textContent = text.slice(i);
				if (i < text.length) setTimeout(s, 24); else { th.classList.remove('typing'); resolve(); }
			})();
		});
	};
	var swap = function (i) {
		tin.classList.remove('in'); tin.classList.add('out');
		return sleep(320).then(function () { tin.classList.remove('out'); fill(i); tin.classList.add('in'); });
	};
	var play = function (n) {
		var i = n % MAIL.length, m = MAIL[i];
		if (i === 0 && n) { rows.forEach(function (r, k) { setRow(k, '', ''); }); left = MAIL.length; imbox.textContent = left; }
		return (n ? swap(i) : Promise.resolve())
			.then(function () { return sleep(700); })
			.then(function () { setChip('work', 'Reading'); setRow(i, 'work', 'Reading'); return sleep(900); })
			.then(function () {
				if (m.mine) {
					t.textContent = m.text; rest.textContent = '';
					th.setAttribute('data-s', 'mine');
					setChip('mine', 'For you', 'i-lock'); setRow(i, 'mine', 'For you', 'i-lock');
					return sleep(3400);
				}
				var writing = m.by ? m.by + ' is writing' : 'Drafting';
				setChip('work', writing); setRow(i, 'work', writing);
				return type(m.text)
					.then(function () {
						var ready = m.auto ? 'Verified' : 'Draft ready';
						th.setAttribute('data-s', 'ready'); setChip('ready', ready, 'i-check'); setRow(i, 'ready', ready);
						return sleep(1500);
					})
					// Sure enough to send itself: it waits out the hold (shortened here), no key press.
					.then(function () {
						if (m.auto) {
							send.firstChild.textContent = 'sends in 15 min';
							setChip('work', 'Sending'); setRow(i, 'work', 'Sending');
							return sleep(1700);
						}
						send.classList.add('press');
						return sleep(160);
					})
					.then(function () {
						var done = m.auto ? 'Sent by Bridle' : 'Sent';
						send.classList.remove('press');
						send.firstChild.textContent = 'Sent';
						th.setAttribute('data-s', 'sent');
						setChip('sent', done, 'i-check'); setRow(i, 'sent', done, 'i-check');
						imbox.textContent = --left; bump(imbox);
						return sleep(1300);
					});
			})
			.then(function () { return play(n + 1); });
	};

	fill(0);
	if (reduce) {
		t.textContent = MAIL[0].text; rest.textContent = '';
		th.setAttribute('data-s', 'ready'); setChip('ready', 'Draft ready', 'i-check'); setRow(0, 'ready', 'Draft ready');
		return;
	}
	if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: .3 }).observe(panel);
	else visible = true;
	gate().then(function () { return sleep(400); }).then(function () { return play(0); });
})();

/* ── Three cells, three small dot stories ── */
document.querySelectorAll('[data-art]').forEach(function (art) {
	var kind = art.dataset.art;
	var dots = new Dots(art.querySelector('canvas'), { pitch: 8, palette: ['#c9c9c3', '#679eee', '#b4b4ae', '#181818', '#f2b51d', '#2d6fcd', '#a7c5f2'], rMin: 0, fill: .46 });
	var BASE = 0, BLUE = 1, GRAY = 2, INK = 3, DEEP = 5, HALO = 6;
	var T = 0, S = {};
	// A row of dots snapped to the grid, so every dot in it is full size.
	var line = function (x0, x1, y, amp, col) {
		y = dots.rowY(y);
		for (var i = Math.ceil((x0 - dots.ox) / dots.p); dots.cx(i) <= x1; i++) dots.stamp(dots.cx(i), y, 2.6, 2.6, amp, col);
	};
	var setup = function () {
		dots.size();
		var w = dots.w, h = dots.h, p = dots.p;
		S = { list: [], next: 0, rows: 0, hold: 0, fade: 1 };
		if (kind === 'sort') S.rails = [dots.rowY(h * .3), dots.rowY(h * .3) + p * 3, dots.rowY(h * .3) + p * 6];
		if (kind === 'draft') {
			S.ty = dots.rowY(h * .5);
			S.src = [dots.rowY(h * .22), S.ty, dots.rowY(h * .78)];
		}
		if (kind === 'send') {
			// A check in a rounded frame, sampled into the grid twice: checking and checked.
			var cx = Math.round(w * .3), cy = Math.round(h / 2);
			var key = function (dy, k) {
				return dots.sample(function (g) {
					g.translate(cx, cy + dy); g.scale(k * 1.22, k * 1.22);
					g.lineWidth = 6; g.lineCap = g.lineJoin = 'round'; g.strokeStyle = '#000';
					g.beginPath();
					if (g.roundRect) g.roundRect(-54, -44, 108, 88, 18); else g.rect(-54, -44, 108, 88);
					g.stroke();
					g.lineWidth = 9;
					g.beginPath(); g.moveTo(-24, 2); g.lineTo(-7, 19); g.lineTo(25, -15); g.stroke();
				});
			};
			S.up = key(-2, 1); S.down = key(3, .94);
		}
	};
	var stories = {
		// Mail falls in. People land as rows in the Inbox, the rest drops through.
		sort: function (dt) {
			var w = dots.w, h = dots.h, rails = S.rails;
			S.next -= dt;
			if (S.next <= 0 && S.fade === 1) {
				var people = S.list.filter(function (q) { return q.person; }).length;
				var person = people < 3 && (Math.random() < .5 || S.list.length > 2);
				S.list.push({ person: person, slot: person ? people : -1, x: w * (.22 + Math.random() * .56), y: -12, vx: (Math.random() - .5) * 30, len: 0, a: 1 });
				S.next = .55 + Math.random() * .35;
			}
			S.list = S.list.filter(function (q) {
				if (q.person) {
					var ty = rails[q.slot];
					q.y = Math.min(ty, q.y + 150 * dt);
					if (q.y >= ty) { q.len = Math.min(1, q.len + dt * 1.8); q.x = lerp(q.x, w / 2, Math.min(1, dt * 4)); }
					return true;
				}
				q.y += 170 * dt; q.x += q.vx * dt; q.a = 1 - smooth(h * .62, h, q.y);
				return q.y < h + 20;
			});
			var full = S.list.filter(function (q) { return q.person && q.len >= 1; }).length === 3;
			if (full) { S.hold += dt; if (S.hold > 1.8) S.fade = Math.max(0, S.fade - dt * 2); }
			if (S.fade === 0) { S.list = []; S.hold = 0; S.fade = 1; S.next = .3; }
			dots.clear();
			rails.forEach(function (y) { line(w * .14, w * .86, y, .13, BASE); });
			S.list.forEach(function (q) {
				var a = q.person ? S.fade : q.a;
				dots.stamp(q.x, q.y, lerp(9, w * .2, q.len), lerp(9, 3.4, q.len), .92 * a, q.person ? BLUE : GRAY);
				if (q.person && q.len < .4) dots.stamp(q.x, q.y, 4, 4, .92 * a, DEEP);
			});
		},
		// Your replies, docs and orders pour into one draft that writes itself.
		draft: function (dt) {
			var w = dots.w, p = dots.p, ty = S.ty, sx = w * .1, tx = w * .48, end = w * .9;
			T += dt;
			var c = T % 6, fade = 1 - smooth(5.3, 6, c);
			dots.clear();
			S.src.forEach(function (y, i) {
				line(sx, sx + w * (.13 - i * .02), y - p, .85, i === 1 ? INK : GRAY);
				line(sx, sx + w * (.08 + i * .015), y, .6, GRAY);
			});
			if (c < 3) {
				for (var n = 0; n < 12; n++) {
					var s = (c * .9 + n / 12) % 1, from = S.src[n % 3];
					var bx = lerp(sx + w * .12, tx, s), by = lerp(from, ty, s * s * (3 - 2 * s));
					dots.stamp(bx, by, 3.2, 3.2, .85 * Math.sin(s * 3.14) * (1 - smooth(2.4, 3, c)), BLUE);
				}
			}
			dots.stamp(tx, ty, 8, 8, (.5 + .4 * smooth(.2, 1.2, c)) * fade, DEEP);
			[[1.2, 2.6, 1], [2.5, 3.6, .78], [3.5, 4.3, .5]].forEach(function (L, i) {
				var g = smooth(L[0], L[1], c);
				if (!g) return;
				var y = ty + (i - 1) * p * 2, x1 = tx + 18 + (end - tx - 18) * L[2] * g;
				line(tx + 18, x1, y, .8 * fade, BLUE);
				if (g < 1) dots.stamp(x1, y, 4, 4, .95, DEEP);
			});
		},
		// The draft is checked against your knowledge. When it holds up, it goes.
		send: function (dt) {
			var w = dots.w, h = dots.h, y = dots.rowY(h / 2), x0 = w * .66;
			T += dt;
			var c = T % 4.6, down = c > 1.7 && c < 2.05;
			dots.clear();
			var I = dots.I, C = dots.C, cap = down ? S.down : S.up;
			for (var k = 0; k < I.length; k++) {
				var v = cap[k] * (down ? .95 : .7);
				if (v > I[k]) { I[k] = v; C[k] = down ? BLUE : INK; }
			}
			var go = smooth(1.9, 3.1, c), back = smooth(3.7, 4.6, c);
			if (c < 1.9) dots.stamp(x0, y, 24, 3.6, .55 + .25 * Math.sin(T * 4), HALO);
			else if (go < 1) dots.stamp(lerp(x0, w + 120, go * go), y, lerp(24, 40, go), 3.4, .92, DEEP);
			else dots.stamp(x0, y, 24, 3.6, .7 * back, HALO);
		}
	};
	var scene = { on: false, tick: function (dt) { stories[kind](dt); dots.render(); } };
	var reset = function () { setup(); if (reduce) { for (var s = 0; s < 40; s++) stories[kind](.1); } scene.tick(0); };
	resizers.push(reset);
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(reset);
	reset();
	if (!reduce) watch(scene, art);
});


/* ── Bring your own agent: pick a logo, watch that agent answer through Bridle ── */
(function () {
	var box = document.getElementById('agents-demo'), chat = document.getElementById('agent-chat');
	if (!box || !chat) return;
	var AGENTS = {
		chatgpt: { name: 'ChatGPT', logo: 'l-openai', who: 'Maya', doc: 'Moving a license' },
		claude: { name: 'Claude', logo: 'l-claude', who: 'Leo', doc: 'Export settings' },
		codex: { name: 'Codex', logo: 'l-codex', who: 'Tom', doc: 'Safari display fix' },
		cursor: { name: 'Cursor', logo: 'l-cursor', who: 'Ana', doc: 'Staging sites' }
	};
	var ORDER = ['chatgpt', 'claude', 'codex', 'cursor'];
	var buttons = box.querySelectorAll('[data-agent]'), body = chat.querySelector('.chat-body');
	var ask = chat.querySelector('.ask'), list = chat.querySelector('.steps'), name = chat.querySelector('[data-name]');
	var cur = 'claude', run = 0, visible = false;

	var steps = function (a) {
		return [
			['Reading ' + a.who + '’s email', 'Read ' + a.who + '’s email'],
			['Searching your docs', 'Found the answer in your docs', a.doc],
			['Writing a reply', 'Saved a draft in Bridle']
		];
	};
	var row = function (cls, text, chip, ic) {
		var li = el('li', cls), st = el('span', 'st');
		st.appendChild(icon(ic || 'i-check'));
		li.appendChild(st); li.appendChild(el('span', 'tx', text));
		if (chip) li.appendChild(el('em', null, chip));
		return li;
	};
	var gateRow = function () {
		var li = row('hold', 'Sending waits for your OK', null, 'i-lock');
		li.appendChild(el('span', 'sw'));
		return li;
	};
	var select = function (key) {
		cur = key;
		var a = AGENTS[key];
		buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-agent') === key)); });
		chat.querySelectorAll('[data-logo]').forEach(function (u) { u.setAttribute('href', '#' + a.logo); });
		name.textContent = a.name;
		ask.textContent = 'Answer ' + a.who + '’s email.';
		list.textContent = '';
		return a;
	};
	// The finished state: what reduced motion shows, and where every loop lands.
	var still = function (key) {
		var a = select(key);
		ask.classList.add('on');
		steps(a).forEach(function (s) { list.appendChild(row('on done', s[1], s[2])); });
		list.appendChild(gateRow()); list.lastChild.classList.add('on');
	};
	// Waits that pause while the section is off screen, and stop when another agent is picked.
	var wait = function (ms, id) {
		return new Promise(function (res, rej) {
			(function c(left) {
				if (id !== run) return rej();
				if (!visible || document.hidden) return setTimeout(function () { c(left); }, 250);
				if (left <= 0) return res();
				setTimeout(function () { c(left - 100); }, 100);
			})(ms);
		});
	};
	var play = function (key) {
		var id = ++run, a;
		body.classList.add('swap');
		wait(300, id).then(function () {
			a = select(key); ask.classList.remove('on');
			body.classList.remove('swap');
			return wait(250, id);
		}).then(function () {
			ask.classList.add('on');
			var chain = wait(700, id);
			steps(a).forEach(function (s) {
				chain = chain.then(function () {
					var li = row('busy', s[0]); list.appendChild(li);
					void li.offsetWidth; li.classList.add('on');
					return wait(1000, id).then(function () {
						li.classList.remove('busy'); li.classList.add('done');
						li.querySelector('.tx').textContent = s[1];
						if (s[2]) li.appendChild(el('em', null, s[2]));
						return wait(350, id);
					});
				});
			});
			return chain;
		}).then(function () {
			var g = gateRow(); list.appendChild(g); void g.offsetWidth; g.classList.add('on');
			return wait(3800, id);
		}).then(function () {
			play(ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]);
		}).catch(function () {});
	};

	buttons.forEach(function (b) {
		b.addEventListener('click', function () {
			var key = b.getAttribute('data-agent');
			if (reduce) still(key); else play(key);
		});
	});
	if (reduce) { still(cur); return; }
	still(cur);
	var started = false;
	var go = function () { if (!started) { started = true; play(cur); } };
	if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) go(); }, { threshold: .35 }).observe(chat);
	else { visible = true; go(); }
})();
