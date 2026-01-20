<script>
(function () {
  // Можно ограничить область, если на странице несколько калькуляторов:
  // Укажи ID контейнера нужного блока, например: '#rec1803879922'
  // var ROOT_SELECTOR = '#rec1803879922';
  var ROOT_SELECTOR = 'body';

  function formatThousandsSpaces(input) {
    if (input == null) return '';
    var s = String(input).replace(/\u00A0/g, ' ').trim();
    if (!s) return s;

    var sign = '';
    if (s[0] === '-' || s[0] === '+') {
      sign = s[0];
      s = s.slice(1);
    }

    s = s.replace(/\s+/g, '');

    // определяем десятичный разделитель (берём последний из '.' или ',')
    // пример: "12,345.67" -> '.' будет десятичным, а запятая проигнорируется
    var lastDot = s.lastIndexOf('.');
    var lastComma = s.lastIndexOf(',');
    var decSep = (lastDot > -1 || lastComma > -1) ? (lastDot > lastComma ? '.' : ',') : null;

    var intPart = s;
    var fracPart = '';

    if (decSep) {
      var idx = s.lastIndexOf(decSep);
      intPart = s.slice(0, idx);
      fracPart = s.slice(idx + 1);
    }

    // оставляем только цифры (на случай, если там вдруг ₽, "руб." и т.п.)
    intPart = intPart.replace(/\D+/g, '');
    fracPart = fracPart.replace(/\D+/g, '');

    if (!intPart) return String(input); // если цифр нет — ничего не делаем

    // группировка по 3 (120000 -> "120 000")
    var formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    // дробную часть возвращаем только если она реально была
    return sign + formattedInt + (decSep && fracPart ? decSep + fracPart : '');
  }

  function apply(el) {
    if (!el) return;
    var cur = (el.textContent || '').trim();
    var formatted = formatThousandsSpaces(cur);
    if (formatted !== cur) el.textContent = formatted;
  }

  function observe(el) {
    apply(el);
    // MutationObserver ловит пересчёт/перерисовку Тильды и форматирует число повторно
    var mo = new MutationObserver(function () { apply(el); });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    var root = document.querySelector(ROOT_SELECTOR) || document;

    // Находим все элементы с итоговым значением калькулятора и начинаем за ними следить
    var nodes = root.querySelectorAll('.t-calc');
    for (var i = 0; i < nodes.length; i++) observe(nodes[i]);

    // Запасной триггер на пользовательский ввод:
    // иногда Тильда обновляет .t-calc после событий input/change — тогда форматируем ещё раз.
    document.addEventListener('input', function (e) {
      if (!e || !e.target) return;
      if (e.target.closest && e.target.closest('.t-form')) {
        // setTimeout(..., 0) — дождаться, когда Тильда закончит обновление DOM
        setTimeout(function () {
          var n = root.querySelectorAll('.t-calc');
          for (var j = 0; j < n.length; j++) apply(n[j]);
        }, 0);
      }
    }, true);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
</script>
