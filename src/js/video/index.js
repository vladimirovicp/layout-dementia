/* Универсальный скрипт: поддерживает YouTube и VK (а также любой кастомный iframe через data-video-src) */
(function () {
  const PREVIEW_SELECTOR = '.video-preview';
  const THUMB_SELECTOR = '.video-preview__thumb';
  const PLAY_CLASS = 'is-playing';
  let preconnected = { youtube: false, vk: false, other: false };

  // Создаёт iframe для конкретного провайдера.
  // options: { provider: 'youtube'|'vk'|'other', id: '...', src: '...' }
  function createIframe(options = {}) {
    const iframe = document.createElement('iframe');
    iframe.className = 'video-preview__iframe';
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 360ms ease';
    iframe.style.position = 'absolute';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';

    if (options.provider === 'youtube' && options.id) {
      // privacy-friendly domain + autoplay + modestbranding + rel=0
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(options.id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'YouTube video player');
    } else if (options.provider === 'vk' && options.src) {
      // Для VK передаём готовый src (обычно video_ext.php?...)
      iframe.src = options.src;
      // у VK также можно включить autoplay, но обычно embed уже содержит нужные параметры
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'VK video player');
    } else if (options.provider === 'other' && options.src) {
      iframe.src = options.src;
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Embedded video');
    } else {
      console.warn('video-preview: unsupported provider or missing id/src', options);
      return null;
    }

    return iframe;
  }

  // Удаляет iframe из контейнера (останавливает воспроизведение)
  function removeIframe(container) {
    const inner = container.querySelector('.video-preview__inner');
    const iframe = inner && inner.querySelector('.video-preview__iframe');
    if (iframe) iframe.remove();
    container.classList.remove(PLAY_CLASS);
  }

  // Остановка всех кроме указанного
  function stopAllExcept(exceptContainer) {
    const playing = document.querySelectorAll(`${PREVIEW_SELECTOR}.${PLAY_CLASS}`);
    playing.forEach(node => {
      if (node !== exceptContainer) removeIframe(node);
    });
  }

  // preconnect для доменов (делает загрузку iframe быстрее)
  function preconnectDomainFor(provider) {
    if (provider === 'youtube') {
      if (preconnected.youtube) return;
      preconnected.youtube = true;
      const l1 = document.createElement('link'); l1.rel = 'preconnect'; l1.href = 'https://www.youtube-nocookie.com'; document.head.appendChild(l1);
      const l2 = document.createElement('link'); l2.rel = 'preconnect'; l2.href = 'https://www.youtube.com'; document.head.appendChild(l2);
      return;
    }
    if (provider === 'vk') {
      if (preconnected.vk) return;
      preconnected.vk = true;
      const l1 = document.createElement('link'); l1.rel = 'preconnect'; l1.href = 'https://vk.com'; document.head.appendChild(l1);
      const l2 = document.createElement('link'); l2.rel = 'preconnect'; l2.href = 'https://vk.com'; document.head.appendChild(l2);
      return;
    }
    if (!preconnected.other) {
      preconnected.other = true;
      const l = document.createElement('link'); l.rel = 'preconnect'; l.href = location.origin; document.head.appendChild(l);
    }
  }

  // Активация превью — выбираем провайдера по data-* атрибутам
  function activate(container) {
    if (container.classList.contains(PLAY_CLASS)) return;
    // определяем провайдера и источник
    const youtubeId = container.dataset.youtubeId;
    const vkEmbed = container.dataset.vkEmbed; // полный src для iframe
    const providerAttr = (container.dataset.provider || '').toLowerCase();
    const videoSrc = container.dataset.videoSrc; // generic src
    let options = null;

    if (youtubeId) {
      options = { provider: 'youtube', id: youtubeId };
    } else if (vkEmbed) {
      options = { provider: 'vk', src: vkEmbed };
    } else if (providerAttr === 'vk' && videoSrc) {
      options = { provider: 'vk', src: videoSrc };
    } else if (videoSrc) {
      options = { provider: 'other', src: videoSrc };
    } else {
      console.warn('video-preview: no supported data attribute found (data-youtube-id / data-vk-embed / data-video-src)', container);
      return;
    }

    // Останавливаем другие
    stopAllExcept(container);
    container.classList.add(PLAY_CLASS);

    // preconnect соответствующего домена
    preconnectDomainFor(options.provider);

    const inner = container.querySelector('.video-preview__inner');
    if (!inner) return;

    const iframe = createIframe(options);
    if (!iframe) {
      container.classList.remove(PLAY_CLASS);
      return;
    }

    inner.appendChild(iframe);

    // fade-in iframe, fade-out thumb and remove it after transition
    requestAnimationFrame(() => {
      iframe.style.opacity = '1';

      const thumb = inner.querySelector(THUMB_SELECTOR);
      if (thumb) {
        thumb.style.transition = 'opacity 320ms ease';
        thumb.style.opacity = '0';
        setTimeout(() => {
          if (thumb.parentNode) thumb.parentNode.removeChild(thumb);
        }, 350);
      }

      const playBtn = inner.querySelector('.video-preview__play');
      if (playBtn) playBtn.setAttribute('aria-hidden', 'true');
    });
  }

  // Делегированная обработка клика
  function onDocumentClick(e) {
    const target = e.target;
    const preview = target.closest ? target.closest(PREVIEW_SELECTOR) : null;
    if (!preview) return;
    activate(preview);
  }

  // Делегированная поддержка клавиатуры (Enter / Space)
  function onDocumentKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const active = document.activeElement;
    if (!active) return;
    if (active.matches && active.matches(PREVIEW_SELECTOR)) {
      e.preventDefault();
      activate(active);
    }
  }

  // При hover/focus делаем preconnect (ускоряет первую загрузку)
  function onDocumentPointerOver(e) {
    const target = e.target;
    const preview = target.closest ? target.closest(PREVIEW_SELECTOR) : null;
    if (!preview) return;

    // определим какой preconnect имеет смысл сделать:
    if (preview.dataset.youtubeId) preconnectDomainFor('youtube');
    else if (preview.dataset.vkEmbed || (preview.dataset.provider === 'vk' && preview.dataset.videoSrc)) preconnectDomainFor('vk');
    else preconnectDomainFor('other');
  }

  // Ленивая загрузка миниатюр через IntersectionObserver
  function initLazyThumbs() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(THUMB_SELECTOR).forEach(img => {
        if (img.dataset && img.dataset.src) img.src = img.dataset.src;
        if (img.dataset && img.dataset.srcset) img.srcset = img.dataset.srcset;
      });
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset) {
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          delete img.dataset.src;
          delete img.dataset.srcset;
        }
        obs.unobserve(img);
      });
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0.01
    });

    document.querySelectorAll(THUMB_SELECTOR).forEach(img => io.observe(img));
  }

  function init() {
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onDocumentKeydown, true);
    document.addEventListener('pointerover', onDocumentPointerOver, { passive: true, capture: true });

    initLazyThumbs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Экспорт API
  window.__videoPreview = {
    activateContainer: (el) => el && activate(el),
    stopAll: () => stopAllExcept(null)
  };
})();
