<!-- Обязательно поменяй FORM_ID на свой! -->

<!-- QZ101 / квизы Тильды: ограничение множественного выбора до 2 вариантов -->
<style>
  /* Сообщение-подсказка рядом с кликом */
  .t-quiz__cursor-message {
    position: fixed;           /* важно: чтобы можно было ставить left/top из JS */
    z-index: 10000;
    pointer-events: none;

    /* внешний вид (можешь менять под свой стиль) */
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.25;
    max-width: 260px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);

    /* позиционирование относительно точки (центр по X, сверху по Y) */
    transform: translate(-50%, -110%);

    /* анимация появления/исчезновения */
    opacity: 0;
    animation: fadeInOutCursor 2s ease-in-out forwards;
  }

  @keyframes fadeInOutCursor {
    0%   { opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { opacity: 0; }
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
  // ================= НАСТРОЙКИ =================

  // Сколько вариантов разрешено выбрать в группе (для чекбоксов)
  var LIMIT = 2;

  // ID формы (квиз/форма Тильды). Меняй на свой.
  // Подсказка: чаще всего в коде страницы это выглядит как formXXXXXXXXX
  var FORM_ID = 'form1826374631';

  // Текст подсказки
  var MESSAGE_TEXT = 'Можно выбрать не более двух вариантов.';

  // Сколько живёт подсказка (мс). Лучше держать в такт с CSS-анимацией (2s)
  var MESSAGE_LIFETIME_MS = 2000;

  // =============================================

  // Последняя известная позиция указателя (мышь/палец/стилус).
  // Нужна для более “точного” показа подсказки рядом с местом клика.
  var lastX = null;
  var lastY = null;
  var lastAt = 0;

  function rememberPoint(x, y) {
    lastX = x;
    lastY = y;
    lastAt = Date.now();
  }

  // Pointer Events — единый способ для мыши и тач-устройств.
  // Плюс оставляем mousemove как фолбэк.
  document.addEventListener('pointerdown', function (e) {
    if (e && typeof e.clientX === 'number') rememberPoint(e.clientX, e.clientY);
  }, true);

  document.addEventListener('pointermove', function (e) {
    if (e && typeof e.clientX === 'number') rememberPoint(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener('mousemove', function (e) {
    if (e && typeof e.clientX === 'number') rememberPoint(e.clientX, e.clientY);
  }, { passive: true });

  // Находим форму
  var form = document.getElementById(FORM_ID);
  if (!form) return;

  function removeOldMessage() {
    var old = document.querySelector('.t-quiz__cursor-message');
    if (old) old.remove();
  }

  // Не даём подсказке уехать за края экрана (viewport)
  function clampToViewport(el, margin) {
    margin = margin || 8;
    var r = el.getBoundingClientRect();
    var dx = 0;
    var dy = 0;

    if (r.left < margin) dx = margin - r.left;
    else if (r.right > window.innerWidth - margin) dx = (window.innerWidth - margin) - r.right;

    if (r.top < margin) dy = margin - r.top;
    else if (r.bottom > window.innerHeight - margin) dy = (window.innerHeight - margin) - r.bottom;

    if (dx || dy) {
      // left/top задаём в px, поэтому корректируем их прямо так
      var left = parseFloat(el.style.left) || 0;
      var top = parseFloat(el.style.top) || 0;
      el.style.left = (left + dx) + 'px';
      el.style.top = (top + dy) + 'px';
    }
  }

  function showMessageNearCheckbox(checkbox, text) {
    removeOldMessage();

    var msg = document.createElement('div');
    msg.className = 't-quiz__cursor-message';
    msg.textContent = text;

    // 1) Если есть “свежая” позиция указателя — показываем около неё
    // 2) Иначе (мобилки/нет мыши) — показываем около самого чекбокса
    var now = Date.now();
    var usePointer = lastX != null && lastY != null && (now - lastAt) < 2000;

    var x, y;

    if (usePointer) {
      x = lastX;
      y = lastY - 10;
    } else {
      var rect = checkbox.getBoundingClientRect();
      x = rect.left + rect.width / 2;

      // Ставим подсказку сверху от элемента,
      // но если сверху места мало — переносим вниз
      y = rect.top - 12;
      if (y < 10) y = rect.bottom + 12;
    }

    msg.style.left = x + 'px';
    msg.style.top = y + 'px';

    document.body.appendChild(msg);

    // Подстраховка: после добавления в DOM “зажимаем” в пределах экрана
    clampToViewport(msg, 8);

    setTimeout(function () {
      if (msg.parentNode) msg.parentNode.removeChild(msg);
    }, MESSAGE_LIFETIME_MS);
  }

  // Ловим изменения чекбоксов внутри формы
  form.addEventListener('change', function (e) {
    // Нам интересны только checkbox
    var checkbox = e.target && e.target.closest ? e.target.closest('input[type="checkbox"]') : null;
    if (!checkbox) return;

    // Группа вариантов (Тильда обычно объединяет опции в .t-input-group)
    var group = checkbox.closest('.t-input-group');
    if (!group) return;

    // Сколько сейчас отмечено в этой группе
    var checked = group.querySelectorAll('input[type="checkbox"]:checked');

    // Если превысили лимит — снимаем текущую галочку и показываем подсказку
    if (checked.length > LIMIT) {
      checkbox.checked = false;
      showMessageNearCheckbox(checkbox, MESSAGE_TEXT);
    }
  });
});
</script>
