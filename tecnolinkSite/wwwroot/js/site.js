// Attribuzione campagne: memorizza i parametri UTM del primo ingresso per tutta
// la sessione, così il lead resta collegato all'annuncio anche dopo altri click.
(function () {
  var KEY = 'tk_campaign';
  var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function read() {
    try { return JSON.parse(window.sessionStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }

  var params = new URLSearchParams(window.location.search);
  var fromUrl = {};
  var found = false;
  FIELDS.forEach(function (f) {
    var v = params.get(f);
    if (v) { fromUrl[f] = v.slice(0, 120); found = true; }
  });
  // Click id delle piattaforme: utili quando gli UTM non vengono passati.
  ['fbclid', 'li_fat_id', 'gclid'].forEach(function (f) {
    var v = params.get(f);
    if (v) { fromUrl[f] = v.slice(0, 200); found = true; }
  });

  if (found) {
    fromUrl.landing = window.location.pathname;
    try { window.sessionStorage.setItem(KEY, JSON.stringify(fromUrl)); } catch (e) { /* ignore */ }
  }

  window.tkCampaign = function () {
    var data = found ? fromUrl : read();
    if (!data) return '';
    return Object.keys(data).map(function (k) { return k + '=' + data[k]; }).join(' | ');
  };
})();

// Analytics: consent-gated GA4 / Meta Pixel / LinkedIn Insight Tag + conversion tracking
(function () {
  var cfg = window.TK_ANALYTICS || { ga4: '', metaPixel: '', linkedIn: '', linkedInLeadConversionId: '' };
  var hasGa4 = !!cfg.ga4;
  var hasPixel = !!cfg.metaPixel;
  var hasLinkedIn = !!cfg.linkedIn;
  var CONSENT_KEY = 'tk_cookie_consent';

  function loadGA4() {
    if (!hasGa4 || window.__tkGa4Loaded) return;
    window.__tkGa4Loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4);
  }

  function loadMetaPixel() {
    if (!hasPixel || window.__tkPixelLoaded) return;
    window.__tkPixelLoaded = true;
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', cfg.metaPixel);
    window.fbq('track', 'PageView');
  }

  function loadLinkedIn() {
    if (!hasLinkedIn || window.__tkLinkedInLoaded) return;
    window.__tkLinkedInLoaded = true;
    window._linkedin_partner_id = String(cfg.linkedIn);
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    if (!window.lintrk) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(s);
  }

  function activateTracking() {
    loadGA4();
    loadMetaPixel();
    loadLinkedIn();
  }

  // Global helper used by the contact form and security-check widget on successful submit.
  window.tkTrackConversion = function (formName) {
    if (window.gtag) window.gtag('event', 'generate_lead', { form_name: formName });
    if (window.fbq) window.fbq('track', 'Lead', { content_name: formName });
    if (window.lintrk && cfg.linkedInLeadConversionId) {
      window.lintrk('track', { conversion_id: Number(cfg.linkedInLeadConversionId) });
    }
  };

  var banner = document.getElementById('tkCookieBanner');
  var hasAnalyticsConfigured = hasGa4 || hasPixel || hasLinkedIn;
  var consent = null;
  try { consent = window.localStorage.getItem(CONSENT_KEY); } catch (e) { /* storage unavailable */ }

  if (hasAnalyticsConfigured && consent === 'granted') {
    activateTracking();
  } else if (hasAnalyticsConfigured && consent !== 'denied' && banner) {
    banner.classList.add('show');
  }

  if (banner) {
    var acceptBtn = document.getElementById('tkCookieAccept');
    var declineBtn = document.getElementById('tkCookieDecline');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try { window.localStorage.setItem(CONSENT_KEY, 'granted'); } catch (e) { /* ignore */ }
        banner.classList.remove('show');
        activateTracking();
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try { window.localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e) { /* ignore */ }
        banner.classList.remove('show');
      });
    }
  }

  // Secondary engagement signals: phone / email link clicks.
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.gtag) window.gtag('event', 'phone_click');
      if (window.fbq) window.fbq('trackCustom', 'PhoneClick');
    });
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.gtag) window.gtag('event', 'email_click');
      if (window.fbq) window.fbq('trackCustom', 'EmailClick');
    });
  });
})();

// Navbar: scrolled shadow + mobile toggle
(function () {
  var nav = document.getElementById('tkNav');
  var toggle = document.getElementById('tkNavToggle');

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    });
  }

  function setMenuOpen(open) {
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    var icon = toggle.querySelector('i');
    if (icon) icon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenuOpen(!nav.classList.contains('menu-open'));
    });
    nav.querySelectorAll('.tk-nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
  }
})();

// Reveal-on-scroll animation
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
})();

// Contact form — submits to the /api/contact endpoint
(function () {
  var form = document.getElementById('tkContactForm');
  if (!form) return;
  var successEl = document.getElementById('tk-form-success');
  var errorEl = document.getElementById('tk-form-error');
  var submitBtn = form.querySelector('button[type="submit"]');
  var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (successEl) successEl.classList.remove('show');
    if (errorEl) errorEl.classList.remove('show');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Invio in corso...';
    }

    var payload = {
      nome: form.nome ? form.nome.value : '',
      email: form.email ? form.email.value : '',
      telefono: form.telefono ? form.telefono.value : '',
      azienda: form.azienda ? form.azienda.value : '',
      dimensione: form.dimensione ? form.dimensione.value : '',
      messaggio: form.messaggio ? form.messaggio.value : '',
      source: form.getAttribute('data-source') || 'Home',
      campagna: typeof tkCampaign === 'function' ? tkCampaign() : '',
      hpField: form.hp_field ? form.hp_field.value : ''
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { httpOk: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.httpOk && result.data && result.data.ok) {
          if (successEl) successEl.classList.add('show');
          form.reset();
          if (typeof tkTrackConversion === 'function') tkTrackConversion('contact_form');
        } else if (errorEl) {
          errorEl.classList.add('show');
        }
      })
      .catch(function () {
        if (errorEl) errorEl.classList.add('show');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
  });
})();

// Scroll progress bar
(function () {
  var bar = document.getElementById('tkProgress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

// Back to top button
(function () {
  var btn = document.getElementById('tkBackToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Animated count-up stats
(function () {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { counterObserver.observe(el); });
})();

// Service card spotlight hover effect
(function () {
  var cards = document.querySelectorAll('.tk-service-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
})();

// Hero network canvas animation
(function () {
  var canvas = document.getElementById('tkHeroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var section = canvas.closest('.tk-hero');
  var particles = [];
  var particleCount = 46;
  var maxDist = 140;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = 'rgba(103, 232, 249, ' + (0.18 * (1 - dist / maxDist)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(function (p) {
      ctx.fillStyle = 'rgba(148, 163, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  window.addEventListener('resize', function () {
    resize();
    initParticles();
  });

  if (!reduceMotion) {
    requestAnimationFrame(tick);
  }
})();

// Security Check widget — animated multi-step analysis, backed by a real lead submission
(function () {
  var form = document.getElementById('tkScanForm');
  if (!form) return;
  var btn = document.getElementById('tkScanBtn');
  var steps = document.querySelectorAll('#tkScanSteps .tk-scan-step');
  var result = document.getElementById('tkScanResult');
  var errorEl = document.getElementById('tkScanFormError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Analisi in corso...';
    if (errorEl) errorEl.classList.remove('show');

    var payload = {
      azienda: form.azienda ? form.azienda.value : '',
      email: form.email ? form.email.value : '',
      hpField: form.hp_field ? form.hp_field.value : ''
    };

    var submitPromise = fetch('/api/security-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return res.ok && data && data.ok;
        });
      })
      .catch(function () { return false; });

    steps.forEach(function (s) { s.classList.remove('active', 'done'); });
    result.classList.remove('show');

    var i = 0;
    function runStep() {
      if (i > 0) steps[i - 1].classList.replace('active', 'done');
      if (i < steps.length) {
        steps[i].classList.add('active');
        i++;
        setTimeout(runStep, 650);
      } else {
        submitPromise.then(function (success) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Invia un\'altra richiesta';
          if (success) {
            result.classList.add('show');
            form.reset();
            if (typeof tkTrackConversion === 'function') tkTrackConversion('security_check');
          } else if (errorEl) {
            errorEl.classList.add('show');
          }
        });
      }
    }
    runStep();
  });
})();
