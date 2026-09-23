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

  // Consent revocation (Privacy page). Clearing the stored choice is not enough on
  // its own: if the visitor had accepted, GA4 / Pixel / Insight Tag are already loaded
  // in this page and keep running until it goes away. So we clear and reload — the
  // page comes back with no tag active and the banner asking again, which is what
  // "revoca il consenso" has to mean if it means anything.
  var resetBtn = document.getElementById('tkConsentReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      try { window.localStorage.removeItem(CONSENT_KEY); } catch (e) { /* storage unavailable */ }
      if (hasAnalyticsConfigured) {
        window.location.reload();
      } else {
        // Nothing is configured, so there is no banner to bring back and nothing was
        // ever loaded. Saying so is better than a button that appears to do nothing.
        resetBtn.disabled = true;
        resetBtn.textContent = 'Nessuno strumento di misurazione è attivo su questo sito.';
      }
    });
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

// Messaggio mostrato quando la richiesta arriva al sito ma non riesce a uscire
// verso la casella di posta — server SMTP irraggiungibile, credenziali sbagliate,
// provider che rifiuta. Fino a ieri in questo caso il visitatore vedeva comunque
// "Grazie! Ti contatteremo al più presto": la richiesta spariva e lui restava ad
// aspettare una risposta che non sarebbe mai arrivata.
//
// Non dice "riprova", di proposito. Se la posta è rotta lo è anche al secondo
// tentativo, e dopo cinque invii il limitatore anti-abuso blocca l'indirizzo IP
// per dieci minuti: lo manderemmo a sbattere contro un muro. L'unica strada che
// funziona davvero in quel momento è il telefono.
// Mostra il riquadro d'errore di un modulo. Con "html" a null rimette il testo
// che sta nell'HTML della pagina — quello generico dei guasti di rete — così il
// messaggio giusto torna al suo posto anche dopo che è stato sostituito.
function tkMostraErrore(el, html) {
  if (!el) return;
  if (el.getAttribute('data-testo-originale') === null) {
    el.setAttribute('data-testo-originale', el.innerHTML);
  }
  el.innerHTML = html || el.getAttribute('data-testo-originale');
  el.classList.add('show');
}

var TK_MSG_NON_RECAPITATO =
  'La richiesta è arrivata al sito, ma non siamo riusciti a inoltrarla alla nostra casella. ' +
  'Per non farti aspettare invano, chiamaci allo <a href="tel:+39055617008">055 617008</a> ' +
  'o scrivi a <a href="mailto:info@tecnolink.it">info@tecnolink.it</a>.';

// Contact form — submits to the /api/contact endpoint
(function () {
  var form = document.getElementById('tkContactForm');
  if (!form) return;
  var successEl = document.getElementById('tk-form-success');
  var errorEl = document.getElementById('tk-form-error');
  var submitBtn = form.querySelector('button[type="submit"]');
  var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  function mostraErrore(html) { tkMostraErrore(errorEl, html); }

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
        var data = result.data || {};
        var accettata = result.httpOk && data.ok;

        // "delivered" dice se la mail è davvero partita verso la nostra casella.
        // Il percorso honeypot risponde {ok:true} senza questo campo: lì l'assenza
        // vale come successo, altrimenti un bot capirebbe di essere stato
        // riconosciuto e la trappola smetterebbe di funzionare.
        if (accettata && data.delivered === false) {
          mostraErrore(TK_MSG_NON_RECAPITATO);
          // Niente form.reset(): i dati restano nei campi, così se il visitatore
          // preferisce scriverci a mano ha ancora sotto gli occhi quello che aveva
          // compilato.
          //
          // E niente conversione verso GA4, Meta e LinkedIn. Una richiesta che non
          // ci è mai arrivata non è un contatto acquisito: contarla insegnerebbe
          // alle piattaforme a comprare altro traffico come quello, mentre la
          // casella resta vuota — e i numeri sani nascondono il guasto proprio
          // quando serve accorgersene.
        } else if (accettata) {
          if (successEl) successEl.classList.add('show');
          form.reset();
          if (typeof tkTrackConversion === 'function') tkTrackConversion('contact_form');
        } else {
          mostraErrore(null);
        }
      })
      .catch(function () {
        mostraErrore(null);
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
          data = data || {};
          // Come per il modulo contatti: "accettata" dice che la richiesta è
          // arrivata al sito, "recapitata" che è uscita verso la nostra casella.
          // Sono due cose diverse, e finora le trattavamo come una sola.
          return {
            accettata: res.ok && data.ok === true,
            recapitata: data.delivered !== false
          };
        });
      })
      .catch(function () { return { accettata: false, recapitata: false }; });

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
        submitPromise.then(function (esito) {
          btn.disabled = false;
          var etichettaRiprova = '<i class="bi bi-arrow-repeat"></i> Invia un\'altra richiesta';

          if (esito.accettata && !esito.recapitata) {
            // Il pulsante non invita a riprovare: se la posta è rotta adesso lo è
            // anche al tentativo dopo, e al sesto invio il limitatore anti-abuso
            // blocca l'IP per dieci minuti. Il messaggio manda al telefono.
            btn.innerHTML = '<i class="bi bi-shield-exclamation"></i> Richiesta non recapitata';
            tkMostraErrore(errorEl, TK_MSG_NON_RECAPITATO);
          } else if (esito.accettata) {
            btn.innerHTML = etichettaRiprova;
            result.classList.add('show');
            form.reset();
            if (typeof tkTrackConversion === 'function') tkTrackConversion('security_check');
          } else {
            btn.innerHTML = etichettaRiprova;
            tkMostraErrore(errorEl, null);
          }
        });
      }
    }
    runStep();
  });
})();

// Video di presentazione
// Ce ne sono due in pagina, con lo stesso file: uno nell'hero, che si vede solo
// da desktop, e uno nella sua sezione, che si vede solo da telefono. Ne parte
// uno soltanto — quello nascosto non viene nemmeno scaricato, ed è il motivo per
// cui l'attributo `autoplay` non c'è sul tag: lo farebbe scaricare comunque
// tutti e due. Il file non ha traccia audio (generato con "--muto"), quindi non
// c'è niente da silenziare e può partire da solo senza dare noia.
(function () {
  var nellHero = document.getElementById('tkVideoHero');
  var nellaSezione = document.getElementById('tkVideoHome');
  var tutti = [nellHero, nellaSezione].filter(Boolean);
  if (!tutti.length) return;

  var bottone = document.getElementById('tkVideoPausa');
  var fermatoAMano = false;
  var daDesktop = window.matchMedia('(min-width: 992px)');
  // Qui NON si guarda `prefers-reduced-motion`, ed è una scelta: su Windows
  // quell'impostazione risulta attiva a un sacco di gente che non l'ha mai
  // toccata (basta avere gli effetti di animazione spenti), e il video restava
  // fermo sul poster senza che si capisse perché. Non ha traccia audio e c'è il
  // comando di pausa, quindi parte sempre.

  // Quale dei due è quello buono adesso: lo decide la stessa soglia del CSS.
  function attivo() {
    return daDesktop.matches ? nellHero : nellaSezione;
  }

  function aggiornaBottone() {
    if (!bottone || !nellaSezione) return;
    var inPausa = nellaSezione.paused;
    bottone.querySelector('span').textContent = inPausa ? 'Riprendi' : 'Pausa';
    bottone.querySelector('i').className = inPausa ? 'bi bi-play-fill' : 'bi bi-pause-fill';
    bottone.setAttribute('aria-label', inPausa ? 'Riprendi il video' : 'Metti in pausa il video');
  }

  function avvia(v) {
    if (!v) return;
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
    // play() torna una promise rifiutata se il browser blocca la riproduzione:
    // senza il catch finisce un errore in console a ogni giro.
    var p = v.play();
    if (p && p.catch) p.catch(function () { aggiornaBottone(); });
  }

  function sistema() {
    var buono = attivo();
    tutti.forEach(function (v) {
      if (v !== buono && !v.paused) v.pause();
    });
    if (fermatoAMano) return;
    avvia(buono);
  }

  if (bottone && nellaSezione) {
    bottone.addEventListener('click', function () {
      if (nellaSezione.paused) { fermatoAMano = false; avvia(nellaSezione); }
      else { fermatoAMano = true; nellaSezione.pause(); }
      aggiornaBottone();
    });
    nellaSezione.addEventListener('play', aggiornaBottone);
    nellaSezione.addEventListener('pause', aggiornaBottone);
  }

  // Al cambio di larghezza si scambiano i ruoli: parte l'altro e questo si ferma.
  if (daDesktop.addEventListener) daDesktop.addEventListener('change', sistema);
  else if (daDesktop.addListener) daDesktop.addListener(sistema);

  sistema();
})();
