/**
 * Tags Input — haven-ui
 *
 * Turns a `.tags-input` wrapper into a free-entry tag chip input.
 *
 * HTML contract:
 *   <div class="tags-input" data-tags-input data-max="5" data-placeholder="Add a tag…">
 *     <!-- tags-input-tag elements are injected here by JS -->
 *     <input type="text" class="tags-input-field" placeholder="Add a tag…">
 *   </div>
 *
 * Attributes:
 *   data-tags-input         — required, marks the wrapper for init
 *   data-max="N"            — optional, max number of tags
 *   data-initial="a,b,c"    — optional, comma-separated initial tags
 *   data-duplicates="false" — optional, allow duplicates (default: false)
 */

(function () {
  'use strict';

  function initTagsInput(wrapper) {
    const input = wrapper.querySelector('.tags-input-field');
    if (!input || wrapper._tagsInitialized) return;
    wrapper._tagsInitialized = true;

    const max = parseInt(wrapper.dataset.max, 10) || Infinity;
    const allowDuplicates = wrapper.dataset.duplicates === 'true';
    const tags = [];

    // Focus wrapper when clicking anywhere in it
    wrapper.addEventListener('click', function () {
      if (!wrapper.classList.contains('tags-input-disabled')) {
        input.focus();
      }
    });

    // Focus / blur state on wrapper
    input.addEventListener('focus', function () {
      wrapper.classList.add('tags-input-focused');
    });
    input.addEventListener('blur', function () {
      wrapper.classList.remove('tags-input-focused');
    });

    // Add tag on Enter or comma
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const value = input.value.replace(/,/g, '').trim();
        if (value) {
          addTag(value);
        }
      }

      // Remove last tag on Backspace when input is empty
      if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
    });

    // Also add tag on blur (if there is text)
    input.addEventListener('blur', function () {
      const value = input.value.replace(/,/g, '').trim();
      if (value) {
        addTag(value);
      }
    });

    function addTag(value) {
      // Normalize
      const normalized = value.trim();
      if (!normalized) return;

      // Duplicate check
      if (!allowDuplicates && tags.indexOf(normalized) !== -1) {
        input.value = '';
        return;
      }

      // Max check
      if (tags.length >= max) {
        input.value = '';
        return;
      }

      tags.push(normalized);
      renderTag(normalized);
      input.value = '';
      updateCount();

      // Hide input if max reached
      if (tags.length >= max) {
        input.style.display = 'none';
      }

      // Dispatch change event
      wrapper.dispatchEvent(new CustomEvent('tags-change', { detail: { tags: tags.slice() } }));
    }

    function removeTag(value) {
      const idx = tags.indexOf(value);
      if (idx === -1) return;
      tags.splice(idx, 1);

      // Remove the DOM element
      var tagEls = wrapper.querySelectorAll('.tags-input-tag');
      tagEls.forEach(function (el) {
        if (el.dataset.value === value) {
          el.remove();
        }
      });

      // Show input again if under max
      if (tags.length < max) {
        input.style.display = '';
      }

      updateCount();
      input.focus();

      wrapper.dispatchEvent(new CustomEvent('tags-change', { detail: { tags: tags.slice() } }));
    }

    function renderTag(value) {
      var tag = document.createElement('span');
      tag.className = 'tags-input-tag';
      tag.dataset.value = value;
      tag.innerHTML =
        value +
        ' <button type="button" class="tags-input-tag-remove" aria-label="Remove ' +
        value.replace(/"/g, '&quot;') +
        '"><i class="fa-solid fa-xmark"></i></button>';

      tag.querySelector('.tags-input-tag-remove').addEventListener('click', function (e) {
        e.stopPropagation();
        removeTag(value);
      });

      // Insert before the input
      wrapper.insertBefore(tag, input);
    }

    function updateCount() {
      var countEl = wrapper.parentElement && wrapper.parentElement.querySelector('.tags-input-count');
      if (countEl && max !== Infinity) {
        countEl.textContent = tags.length + ' / ' + max;
      }
    }

    // Initialize with data-initial tags
    var initial = wrapper.dataset.initial;
    if (initial) {
      initial.split(',').forEach(function (t) {
        var trimmed = t.trim();
        if (trimmed) addTag(trimmed);
      });
    }
  }

  // Init all on page
  function initAll() {
    document.querySelectorAll('[data-tags-input]').forEach(initTagsInput);
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
