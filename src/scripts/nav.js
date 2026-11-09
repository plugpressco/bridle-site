/* The capsule menu (src/components/Nav.astro). Product and Resources open on
   hover (with a fine pointer), click, or keyboard focus; the capsule grows
   into a panel and the page behind dims. Esc closes and gives focus back to
   the button; Tab walks into the open panel and out to the next item. On
   phones the Menu button
   opens a full-height sheet with the same groups (focus stays inside it). Also opens a question on
   the page when the address points at it (/#ai-apps). */
var cap = document.getElementById('cap');
var dim = document.getElementById('dim');

if (cap && dim) {
	var trigs = { product: document.getElementById('t-product'), resources: document.getElementById('t-resources') };
	var panels = { product: document.getElementById('m-product'), resources: document.getElementById('m-resources') };
	var current = null, hoverTimer = null, quiet = false, hoverLock = false, lockedAt = 0;

	// The closed capsule hugs its contents; remember that width so the grown
	// panel can shrink back to it smoothly.
	var measure = function () {
		if (current) return;
		cap.style.removeProperty('--cap-w');
		cap.style.width = 'auto';
		var w = cap.getBoundingClientRect().width;
		cap.style.width = '';
		if (window.innerWidth > 960) cap.style.setProperty('--cap-w', Math.ceil(w) + 'px');
	};
	var open = function (name) {
		clearTimeout(hoverTimer);
		if (current === name) return;
		Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== name; trigs[k].setAttribute('aria-expanded', String(k === name)); });
		current = name;
		cap.classList.add('open');
		dim.hidden = false;
		requestAnimationFrame(function () { dim.classList.add('on'); });
	};
	var closeAll = function (focusBack) {
		clearTimeout(hoverTimer);
		if (!current) return;
		var was = current;
		current = null; hoverLock = true; lockedAt = Date.now();
		cap.classList.remove('open');
		dim.classList.remove('on');
		Object.keys(trigs).forEach(function (k) { trigs[k].setAttribute('aria-expanded', 'false'); });
		setTimeout(function () { if (!current) { Object.keys(panels).forEach(function (k) { panels[k].hidden = true; }); dim.hidden = true; } }, 380);
		if (focusBack) { quiet = true; trigs[was].focus(); setTimeout(function () { quiet = false; }, 0); }
	};
	var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	Object.keys(trigs).forEach(function (k) {
		var t = trigs[k];
		t.addEventListener('click', function () { current === k ? closeAll() : open(k); });
		if (hoverable) t.addEventListener('mouseenter', function () { if (hoverLock) return; clearTimeout(hoverTimer); hoverTimer = setTimeout(function () { open(k); }, 90); });
		t.addEventListener('focus', function () { if (!quiet && t.matches(':focus-visible')) open(k); });
	});
	if (hoverable) {
		cap.addEventListener('mouseleave', function () { hoverTimer = setTimeout(function () { if (!cap.contains(document.activeElement)) closeAll(); }, 220); });
		cap.addEventListener('mouseenter', function () { clearTimeout(hoverTimer); });
	}
	document.addEventListener('pointermove', function () { if (hoverLock && Date.now() - lockedAt > 450) hoverLock = false; });
	dim.addEventListener('click', function () { closeAll(); });
	cap.addEventListener('focusout', function (e) { if (current && !cap.contains(e.relatedTarget)) closeAll(); });
	var trap = function (root, e) {
		var f = [].slice.call(root.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) { return el.offsetParent !== null; });
		if (!f.length) return;
		var first = f[0], last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	};
	// Keyboard: Tab (or Arrow down) from an open trigger goes into its panel;
	// Tab from the panel's last link leaves it for the next item in the bar,
	// Shift+Tab from its first link goes back to the trigger.
	var focusables = function (root) { return [].slice.call(root.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) { return el.offsetParent !== null; }); };
	var bar = cap.querySelector('.bar');
	Object.keys(trigs).forEach(function (k) {
		trigs[k].addEventListener('keydown', function (e) {
			if ((e.key === 'Tab' && !e.shiftKey && current === k) || e.key === 'ArrowDown') {
				e.preventDefault();
				open(k);
				requestAnimationFrame(function () { var f = focusables(panels[k]); if (f[0]) f[0].focus(); });
			}
		});
		panels[k].addEventListener('keydown', function (e) {
			if (e.key !== 'Tab') return;
			var f = focusables(panels[k]);
			if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
				var items = focusables(bar), after = items[items.indexOf(trigs[k]) + 1];
				e.preventDefault();
				closeAll();
				if (after) after.focus();
			} else if (e.shiftKey && document.activeElement === f[0]) {
				e.preventDefault();
				trigs[k].focus();
			}
		});
		panels[k].addEventListener('click', function (e) { if (e.target.closest('a')) closeAll(); });
	});

	var sheet = document.getElementById('sheet'), mb = document.getElementById('menu-btn'), sc = document.getElementById('sheet-close');
	var openSheet = function () { sheet.hidden = false; mb.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; sc.focus(); };
	var closeSheet = function (back) { if (sheet.hidden) return; sheet.hidden = true; mb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; if (back) mb.focus(); };
	mb.addEventListener('click', openSheet);
	sc.addEventListener('click', function () { closeSheet(true); });
	sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeSheet(false); });
	sheet.addEventListener('keydown', function (e) { if (e.key === 'Tab') trap(sheet, e); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!sheet.hidden) closeSheet(true); else closeAll(true); } });
	window.addEventListener('hashchange', function () { closeAll(); });

	if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure); else measure();
	window.addEventListener('resize', measure);
}

// A link to a question (/#ai-apps) opens it.
var openTarget = function () {
	var id = decodeURIComponent(location.hash.slice(1));
	var t = id && document.getElementById(id);
	if (t && t.tagName === 'DETAILS') t.open = true;
};
openTarget();
window.addEventListener('hashchange', openTarget);
