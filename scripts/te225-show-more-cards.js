/**
 * TE225: Show more cards on BF101 button click.
 *
 * Настройки:
 * - INITIAL_VISIBLE: сколько карточек показывать при запуске
 * - PER_CLICK: сколько карточек показывать за один клик
 * - CONTAINER_SELECTOR: контейнер карточек
 * - CARD_SELECTOR: карточка
 * - BUTTON_SELECTOR: кнопка BF101
 * - BUTTON_TEXT: текст кнопки (null чтобы не менять)
 */

document.addEventListener('DOMContentLoaded', () => {
  const INITIAL_VISIBLE = 1;
  const PER_CLICK = 1;
  const CONTAINER_SELECTOR = '.t-card__container';
  const CARD_SELECTOR = '.t-card__col';
  const BUTTON_SELECTOR = '.t1331__row .t-btn';
  const BUTTON_TEXT = 'Показать еще';

  const cardsContainer = document.querySelector(CONTAINER_SELECTOR);
  const cards = Array.from(document.querySelectorAll(CARD_SELECTOR));
  const showMoreBtn = document.querySelector(BUTTON_SELECTOR);

  if (!cardsContainer || !showMoreBtn || cards.length === 0) return;

  const initialVisible = Math.max(0, Math.min(INITIAL_VISIBLE, cards.length));
  const perClick = Math.max(1, PER_CLICK);

  cards.forEach((card, index) => {
    if (index >= initialVisible) {
      card.style.display = 'none';
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.5s ease';
    } else {
      card.style.opacity = '1';
    }
  });

  let currentIndex = initialVisible;

  const showNextCards = () => {
    if (currentIndex >= cards.length) return;

    const nextIndex = Math.min(currentIndex + perClick, cards.length);

    for (let i = currentIndex; i < nextIndex; i += 1) {
      const card = cards[i];
      card.style.display = 'block';
      requestAnimationFrame(() => {
        card.style.opacity = '1';
      });
    }

    currentIndex = nextIndex;

    if (currentIndex >= cards.length) {
      showMoreBtn.style.display = 'none';
    }
  };

  showMoreBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showNextCards();
  });

  if (BUTTON_TEXT) {
    const buttonTextEl = showMoreBtn.querySelector('.t-btnflex__text');
    if (buttonTextEl) buttonTextEl.textContent = BUTTON_TEXT;
  }

  if (currentIndex >= cards.length) {
    showMoreBtn.style.display = 'none';
  }
});
