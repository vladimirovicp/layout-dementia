/* JS: делаем поведение универсальным для любых .video-preview на странице */
(function () {
  const PREVIEW_SELECTOR = '.video-preview';

  function createIframe(youtubeId) {
    const iframe = document.createElement('iframe');
    // privacy-friendly domain + autoplay + modestbranding + rel=0
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&modestbranding=1`;
    iframe.className = 'video-preview__iframe';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', 'YouTube video player');
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 360ms ease';
    return iframe;
  }

  function handleActivate(container) {
    if (container.classList.contains('is-playing')) return; // уже
    const id = container.dataset.youtubeId;
    if (!id) return console.warn('video-preview: missing data-youtube-id');

    // mark as playing to change styles
    container.classList.add('is-playing');

    const inner = container.querySelector('.video-preview__inner');
    const iframe = createIframe(id);

    // append iframe under inner (so it covers everything)
    inner.appendChild(iframe);

    // Force a repaint, then fade in iframe and fade out image
    requestAnimationFrame(() => {
      iframe.style.opacity = '1';
      // wait for transition to hide the thumb and remove it from DOM for perf
      const thumb = inner.querySelector('.video-preview__thumb');
      if (thumb) {
        thumb.style.opacity = '0';
        // remove after transition
        setTimeout(() => {
          if (thumb.parentNode) thumb.parentNode.removeChild(thumb);
        }, 380); // чуть больше, чем transition (360ms)
      }

      // hide the play button from accessibility tree
      const playBtn = inner.querySelector('.video-preview__play');
      if (playBtn) {
        playBtn.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // wire up all previews
  function init() {
    const previews = document.querySelectorAll(PREVIEW_SELECTOR);
    previews.forEach(preview => {
      // keyboard activation
      preview.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          handleActivate(preview);
        }
      });

      // click on whole block
      preview.addEventListener('click', (ev) => {
        // allow internal button to trigger too
        handleActivate(preview);
      });

      // play button specifically (prevents double-handling)
      const playBtn = preview.querySelector('.video-preview__play');
      if (playBtn) {
        playBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          handleActivate(preview);
        });
      }
    });
  }

  // init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();