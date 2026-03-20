/**
 * Motion / Animation Demos
 * Pattern library only — triggers animation playback on demo tracks.
 */
(function () {
  'use strict';

  function initMotionDemos() {
    // Play buttons trigger their associated track
    document.querySelectorAll('[data-motion-play]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var trackId = btn.getAttribute('data-motion-play');
        var track = document.getElementById(trackId);
        if (!track) return;

        // Reset: remove class, force reflow, re-add
        track.classList.remove('is-playing');
        void track.offsetWidth; // force reflow
        track.classList.add('is-playing');
      });
    });

    // "Play All" buttons trigger every track within a section
    document.querySelectorAll('[data-motion-play-all]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sectionId = btn.getAttribute('data-motion-play-all');
        var section = document.getElementById(sectionId);
        if (!section) return;

        var tracks = section.querySelectorAll('.motion-demo-track');
        tracks.forEach(function (track) {
          track.classList.remove('is-playing');
          void track.offsetWidth;
          track.classList.add('is-playing');
        });
      });
    });

    // Hover demo cards
    document.querySelectorAll('[data-motion-hover]').forEach(function (el) {
      var demoTarget = document.getElementById(el.getAttribute('data-motion-hover'));
      if (!demoTarget) return;

      el.addEventListener('mouseenter', function () {
        demoTarget.classList.add('is-active');
      });
      el.addEventListener('mouseleave', function () {
        demoTarget.classList.remove('is-active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionDemos);
  } else {
    initMotionDemos();
  }
})();
