<!-- A/B тест: показываем один из двух блоков и запоминаем выбор в localStorage -->
  
<script>
(function () {
  'use strict';

  // ===== НАСТРОЙКИ =====

  // Ключ, под которым сохраняем выбранный вариант в localStorage.
  // Если ты поставишь другой ключ — начнётся “новый эксперимент” для всех пользователей.
  const STORAGE_KEY = 'tilda_ab_variant';

  // ВАЖНО: сюда нужно подставить свои ID блоков.
  const variants = {
    A: 'rec1811552801', // Вариант A (например, текст 1)
    B: 'rec1811554361'  // Вариант B (например, текст 2)
  };

  // ====================

  function hideAll() {
    Object.values(variants).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function showVariant(key) {
    const id = variants[key];
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    hideAll();

    let variant = localStorage.getItem(STORAGE_KEY);

    if (!variant || !variants[variant]) {
      variant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(STORAGE_KEY, variant);
    }

    showVariant(variant);

    // Примечание:
    // Если хочешь отправлять вариант в Яндекс.Метрику (например, как параметр визита/событие),
    // это требует дополнительной настройки — напиши мне в Telegram.
  });
})();
</script>
