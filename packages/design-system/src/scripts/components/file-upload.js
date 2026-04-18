/**
 * File Upload — Drag-and-drop interactivity
 *
 * Adds `is-dragover` class to dropzones during drag events.
 * Triggers the hidden file input when the dropzone or browse link is clicked.
 */
(function () {
  'use strict';

  const dropzones = document.querySelectorAll('[data-file-upload-dropzone]');

  dropzones.forEach(function (zone) {
    const fileInput = zone.querySelector('input[type="file"]');

    // Drag events — add/remove is-dragover class
    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      zone.classList.add('is-dragover');
    });

    zone.addEventListener('dragenter', function (e) {
      e.preventDefault();
      zone.classList.add('is-dragover');
    });

    zone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      // Only remove if leaving the dropzone itself (not a child)
      if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('is-dragover');
      }
    });

    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.classList.remove('is-dragover');
      // Files available at e.dataTransfer.files — integration point
    });

    // Click to browse
    zone.addEventListener('click', function () {
      if (fileInput) {
        fileInput.click();
      }
    });

    // Prevent file input click from bubbling back to zone
    if (fileInput) {
      fileInput.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  });
})();
