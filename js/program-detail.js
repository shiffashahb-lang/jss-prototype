document.addEventListener('DOMContentLoaded', function () {
  var stickyCta = document.getElementById('stickyCta');
  var heroActions = document.querySelector('.hero-program .hero-actions, .hero-actions');
  if (!stickyCta || !heroActions) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    io.observe(heroActions);
  }
});
