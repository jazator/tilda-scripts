<!-- Весь блок SV102 становится целиком кликабельным, а не только кнопка -->
<script>
document.addEventListener("DOMContentLoaded", function() {
    var clickableBlocks = document.querySelectorAll('.t847__item');

    clickableBlocks.forEach(function(block) {
        var link = block.querySelector('a.t-card__link');
        if (link) {
            block.addEventListener('click', function() {
                window.location.href = link.getAttribute('href');
            });
            block.style.cursor = 'pointer';
        }
    });
});
</script>
