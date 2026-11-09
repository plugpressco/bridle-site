// Small helpers shared by the page scripts.
export var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
export var icon = function (id) {
	var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), use = document.createElementNS(ns, 'use');
	svg.setAttribute('class', 'i'); svg.setAttribute('aria-hidden', 'true'); use.setAttribute('href', '#' + id); svg.appendChild(use); return svg;
};
