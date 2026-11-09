/* The hero loop (src/components/home/Hero.astro): the pause button, and a
   rest while it is off screen. With reduced motion the CSS shows the last
   frame and this does nothing. */
var loop = document.getElementById('loop');
var pause = document.getElementById('pause');
if (loop && pause) {
	var userPaused = false;
	var setPaused = function (p) { loop.classList.toggle('paused', p); };
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) pause.hidden = true;
	pause.addEventListener('click', function () {
		userPaused = !userPaused;
		setPaused(userPaused);
		pause.setAttribute('aria-label', userPaused ? 'Play the animation' : 'Pause the animation');
		pause.querySelector('use').setAttribute('href', userPaused ? '#d-play' : '#d-pause');
	});
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(function (es) { es.forEach(function (e) { if (!userPaused) setPaused(!e.isIntersecting); }); }).observe(loop);
	}
}
