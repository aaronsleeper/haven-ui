/**
 * Assessment Slider — fill gradient and value display updates
 * Used on patient assessment question screens with slider-type inputs.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.assess-slider-track').forEach(slider => {
    const update = () => {
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 10;
      const val = parseFloat(slider.value);
      const pct = ((val - min) / (max - min)) * 100;
      slider.style.setProperty('--slider-fill', pct + '%');

      const valueEl = slider.closest('.assess-slider')?.querySelector('.assess-slider-value');
      if (valueEl) {
        valueEl.textContent = slider.value;
      }

      // Update ARIA
      slider.setAttribute('aria-valuenow', slider.value);
    };

    slider.addEventListener('input', update);
    update(); // set initial state
  });
});
