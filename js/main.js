document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var header = document.getElementById('mainNav') ? document.getElementById('mainNav').closest('.site-header') : document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    header.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Auth modal (login / signup) — shared placeholder gate
  --------------------------------------------------------- */
  var overlay = document.getElementById('authModalOverlay');
  if (overlay) {
    var modal = overlay.querySelector('.auth-modal');
    var tabs = overlay.querySelectorAll('.auth-tab');
    var forms = overlay.querySelectorAll('.auth-form');
    var title = overlay.querySelector('.auth-modal-title');
    var sub = overlay.querySelector('.auth-modal-sub');
    var lastFocused = null;

    var copy = {
      login: { title: 'Welcome back', sub: 'Log in to continue your program and pick up where you left off.' },
      signup: { title: 'Create your free account', sub: 'Start free — browse programs and sample lessons right away.' }
    };

    function setTab(name) {
      tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.authTab === name); });
      forms.forEach(function (f) { f.hidden = f.dataset.authForm !== name; });
      if (title && copy[name]) title.textContent = copy[name].title;
      if (sub && copy[name]) sub.textContent = copy[name].sub;
    }

    function openModal(name) {
      lastFocused = document.activeElement;
      setTab(name || 'login');
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      var firstInput = overlay.querySelector('.auth-form:not([hidden]) input');
      if (firstInput) firstInput.focus();
    }

    function closeModal() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    /* Disabled for now — the login/signup modal flow was confusing to
       test alongside the new dashboard/membership pages. Buttons with
       [data-auth-trigger] are inert until this is switched back on.
       To re-enable: uncomment the two blocks below. */
    /*
    document.querySelectorAll('[data-auth-trigger]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(el.dataset.authTrigger);
      });
    });

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { setTab(t.dataset.authTab); });
    });

    overlay.querySelector('.auth-modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeModal();
    });

    forms.forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.dataset.authForm === 'signup') {
          window.location.href = 'dashboard.html';
          return;
        }
        closeModal();
      });
    });
    */
  }

  /* ---------------------------------------------------------
     Testimonial slider — reads window.JSS_TESTIMONIALS
  --------------------------------------------------------- */
  document.querySelectorAll('[data-testimonial-slider]').forEach(function (slider) {
    var data = window.JSS_TESTIMONIALS || [];
    if (!data.length) return;

    var quoteEl = slider.querySelector('.slider-quote');
    var avatarEl = slider.querySelector('.slider-person .avatar');
    var nameEl = slider.querySelector('.slider-person strong');
    var roleEl = slider.querySelector('.slider-person span');
    var countEl = slider.querySelector('.slider-count');
    var prevBtn = slider.querySelector('.slider-arrow.prev');
    var nextBtn = slider.querySelector('.slider-arrow.next');

    var index = 0;

    function render() {
      var item = data[index];
      quoteEl.textContent = '\u201C' + item.quote + '\u201D';
      avatarEl.textContent = item.initials;
      nameEl.textContent = item.name;
      roleEl.textContent = item.role;
      countEl.textContent = (index + 1) + ' / ' + data.length;
    }

    function go(delta) {
      index = (index + delta + data.length) % data.length;
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    // swipe support on touch devices
    var touchStartX = null;
    slider.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchStartX = null;
    }, { passive: true });

    // autoplay, pauses on hover/focus
    var timer = null;
    function play() { timer = setInterval(function () { go(1); }, 7000); }
    function stop() { clearInterval(timer); }
    if (data.length > 1) {
      play();
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', play);
      slider.addEventListener('focusin', stop);
      slider.addEventListener('focusout', play);
    }

    render();
  });

  /* ---------------------------------------------------------
     Learning path helper (community.html)
  --------------------------------------------------------- */
  var pathHelper = document.querySelector('[data-path-helper]');
  if (pathHelper) {
    var chips = pathHelper.querySelectorAll('.path-chip');
    var input = pathHelper.querySelector('.path-helper-input');
    var findBtn = pathHelper.querySelector('.path-helper-find');
    var resultBox = pathHelper.querySelector('.path-helper-result');

    var paths = [
      { match: ['new to it', 'beginner', 'never', 'start'], title: 'Networking Fundamentals for Cybersecurity', desc: 'The best on-ramp with zero IT background — 50 lessons, 15 hrs, free.', href: 'courses.html' },
      { match: ['support', 'help desk', 'helpdesk', 'ticket'], title: 'IT Support Program', desc: 'Help-desk fundamentals through sysadmin skills, with real ticketing-tool practice.', href: 'programs.html#it-support' },
      { match: ['network', 'system', 'server', 'sysadmin', 'windows'], title: 'Systems Engineer Program', desc: 'Server administration, networking, and infrastructure fundamentals.', href: 'programs.html#systems-engineer' },
      { match: ['cyber', 'security', 'soc', 'incident'], title: 'Cybersecurity Analyst Certificate Program', desc: 'Security fundamentals through incident-response labs — 5 courses, 109 hrs.', href: 'cybersecurity-analyst-certificate-program.html' },
      { match: ['cloud', 'aws', 'infrastructure'], title: 'Cloud & Systems Program', desc: 'Hands-on AWS labs and cloud architecture, built around real deployment projects.', href: 'programs.html#cloud' }
    ];

    function findPath(text) {
      var q = text.toLowerCase();
      for (var i = 0; i < paths.length; i++) {
        for (var j = 0; j < paths[i].match.length; j++) {
          if (q.indexOf(paths[i].match[j]) !== -1) return paths[i];
        }
      }
      return null;
    }

    function showResult(text) {
      var path = findPath(text || '');
      if (!path) {
        resultBox.innerHTML = '<div class="path-result-card"><div class="path-result-icon">?</div>' +
          '<div><h4>Tell us a bit more</h4><p>Try a keyword like "cybersecurity", "cloud", or "IT support" — or pick one of the chips above.</p></div></div>';
        return;
      }
      resultBox.innerHTML = '<div class="path-result-card"><div class="path-result-icon">\u2713</div>' +
        '<div><h4>' + path.title + '</h4><p>' + path.desc + '</p><a href="' + path.href + '">View this path \u2192</a></div></div>';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        input.value = '';
        showResult(chip.textContent);
      });
    });

    findBtn.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      showResult(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); findBtn.click(); }
    });
  }

  /* ---------------------------------------------------------
     Catalog search + filter (programs.html / courses.html)
  --------------------------------------------------------- */
  var toolbar = document.querySelector('.catalog-toolbar');
  if (toolbar) {
    var searchInput = toolbar.querySelector('input[type="search"]');
    var pills = toolbar.querySelectorAll('.filter-pill');
    var cards = document.querySelectorAll('.catalog-grid > article, .catalog-grid > .program-card');
    var activeFilter = 'all';

    function applyFilters() {
      var q = (searchInput.value || '').trim().toLowerCase();
      cards.forEach(function (card) {
        var status = card.dataset.status || 'all';
        var matchesFilter = activeFilter === 'all' || status === activeFilter;
        var text = card.textContent.toLowerCase();
        var matchesSearch = !q || text.indexOf(q) !== -1;
        card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
      });
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        activeFilter = pill.dataset.filter;
        applyFilters();
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilters);
  }

  /* ---------------------------------------------------------
     Waitlist forms (Coming soon programs)
  --------------------------------------------------------- */
  document.querySelectorAll('.waitlist-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector('.form-note');
      var emailInput = form.querySelector('input[type="email"]');
      if (!emailInput.checkValidity()) {
        if (note) { note.textContent = 'Enter a valid email address.'; note.classList.add('is-error'); }
        return;
      }
      if (note) {
        note.textContent = 'You\u2019re on the list \u2014 we\u2019ll email you the day it opens.';
        note.classList.remove('is-error');
      }
      form.reset();
      form.querySelector('button').disabled = true;
    });
  });

  /* ---------------------------------------------------------
     Billing toggle (upgrade.html)
  --------------------------------------------------------- */
  var billingToggle = document.querySelector('.billing-toggle');
  if (billingToggle) {
    var billingBtns = billingToggle.querySelectorAll('.billing-toggle-btn');
    var amounts = document.querySelectorAll('.price-amount');
    var billedNote = document.querySelector('.price-billed-note');

    billingBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        billingBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var period = btn.dataset.period;
        amounts.forEach(function (el) {
          var val = el.dataset[period];
          el.textContent = '$' + val;
        });
        if (billedNote) billedNote.hidden = period !== 'yearly';
      });
    });
  }

});
