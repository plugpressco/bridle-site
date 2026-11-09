/* The inner pages' hero art: soft dots that settle into a shape, in the
   closing card's way (settle() in kit.js), light on paper. */
import { settle } from './kit.js';

var SHAPES = {
	// A speech bubble with three dots cut out of it.
	chat: function (g) {
		g.beginPath();
		g.roundRect(5, 8, 50, 36, 11);
		g.moveTo(15, 42); g.lineTo(11, 54); g.lineTo(27, 43.5); g.closePath();
		g.fill();
		g.globalCompositeOperation = 'destination-out';
		[19, 30, 41].forEach(function (x) { g.beginPath(); g.arc(x, 26, 3.6, 0, 6.2832); g.fill(); });
		g.globalCompositeOperation = 'source-over';
	},
	// A key: a round bow with a hole (drawn the other way round, so the
	// nonzero fill leaves it open), a shaft and two teeth.
	key: function (g) {
		g.beginPath();
		g.arc(19, 30, 13, 0, 6.2832);
		g.moveTo(23.5, 30); g.arc(19, 30, 4.5, 0, 6.2832, true);
		g.rect(30, 27, 26, 6.5);
		g.rect(44, 33, 4.5, 8); g.rect(51.5, 33, 4.5, 5.5);
		g.fill();
	}
};

document.querySelectorAll('[data-shape]').forEach(function (box) {
	var shape = SHAPES[box.getAttribute('data-shape')];
	if (!shape) return;
	settle(box, box, { shape: shape, palette: ['#dddcd6', '#679eee', '#a7c5f2'], base: .045, scale: .74, max: 420, pitch: function (w) { return w < 560 ? 8 : 9; } });
});
