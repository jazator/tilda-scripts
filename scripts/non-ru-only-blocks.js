// Non-RU only blocks (browser language) — показывает заданные блоки только если язык браузера НЕ `ru`, т.е. для всех языков, кроме русского.

<script>
(function () {
  'use strict';

  // ===== НАСТРОЙКИ =====
  // Список блоков, которые должны быть видны только для НЕ-RU (по языку браузера)
  var NON_RU_BLOCKS = [
    'rec1811552801'
    // 'rec...'
  ];
  // ====================

  function isRuLanguage() {
    // navigator.language обычно "ru-RU", "en-US" и т.п.
    var lang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    return lang.indexOf('ru') === 0;
  }

  function setDisplayByLang() {
    var ru = isRuLanguage();

    for (var i = 0; i < NON_RU_BLOCKS.length; i++) {
      var id = NON_RU_BLOCKS[i];
      var el = document.getElementById(id);
      if (!el) continue;

      // Если RU — скрываем, если НЕ-RU — показываем
      el.style.display = ru ? 'none' : '';
    }
  }

  function init() {
    setDisplayByLang();

    // Подстраховка для Тильды (иногда блоки дорисовываются после загрузки)
    setTimeout(setDisplayByLang, 300);
    setTimeout(setDisplayByLang, 1200);
  }

  if (typeof window.t_ready === 'function') {
    window.t_ready(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
