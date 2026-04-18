/**
 * Haven Time Picker — syncs radio column selections to the text input.
 *
 * Each .timepicker-wrapper contains:
 *   - An <input type="text"> for display
 *   - An hs-dropdown with radio columns for hours, minutes, and optionally AM/PM
 *
 * Radio groups are identified by name attributes:
 *   - [name$="-hour"]   → hour column
 *   - [name$="-minute"] → minute column
 *   - [name$="-period"] → AM/PM column (12-hour mode only)
 *
 * The "Now" button (data-timepicker-now) sets current time.
 * The "OK" button (data-timepicker-ok) closes the dropdown.
 */

document.addEventListener('DOMContentLoaded', function () {
  initTimepickers();
});

function initTimepickers() {
  var wrappers = document.querySelectorAll('.timepicker-wrapper');

  wrappers.forEach(function (wrapper) {
    var input = wrapper.querySelector('input[type="text"]');
    if (!input) return;

    var panel = wrapper.querySelector('.hs-dropdown-menu');
    if (!panel) return;

    // Listen for radio changes inside the panel
    panel.addEventListener('change', function () {
      syncTimeToInput(wrapper, input);
    });

    // "Now" button
    var nowBtn = panel.querySelector('[data-timepicker-now]');
    if (nowBtn) {
      nowBtn.addEventListener('click', function () {
        setCurrentTime(wrapper, input);
      });
    }

    // "OK" button — close dropdown via Preline
    var okBtn = panel.querySelector('[data-timepicker-ok]');
    if (okBtn) {
      okBtn.addEventListener('click', function () {
        var dropdownEl = wrapper.querySelector('.hs-dropdown');
        if (dropdownEl && window.HSDropdown) {
          var instance = window.HSDropdown.getInstance(dropdownEl);
          if (instance) instance.close();
        }
      });
    }
  });
}

/**
 * Reads checked radios and writes formatted time to the input.
 */
function syncTimeToInput(wrapper, input) {
  var hourRadio = wrapper.querySelector('input[name$="-hour"]:checked');
  var minuteRadio = wrapper.querySelector('input[name$="-minute"]:checked');
  var periodRadio = wrapper.querySelector('input[name$="-period"]:checked');

  if (!hourRadio || !minuteRadio) return;

  var hour = hourRadio.value;
  var minute = minuteRadio.value;

  if (periodRadio) {
    // 12-hour format
    input.value = hour + ':' + minute + ' ' + periodRadio.value;
  } else {
    // 24-hour format
    input.value = hour + ':' + minute;
  }
}

/**
 * Sets current time by checking the appropriate radios.
 */
function setCurrentTime(wrapper, input) {
  var now = new Date();
  var periodRadio = wrapper.querySelector('input[name$="-period"]');
  var is12Hour = !!periodRadio;

  var hours = now.getHours();
  var minutes = now.getMinutes();

  if (is12Hour) {
    var period = hours >= 12 ? 'PM' : 'AM';
    var displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;

    var hVal = String(displayHour).padStart(2, '0');
    var mVal = String(minutes).padStart(2, '0');

    checkRadio(wrapper, '-hour', hVal);
    checkRadio(wrapper, '-minute', mVal);
    checkRadio(wrapper, '-period', period);

    input.value = hVal + ':' + mVal + ' ' + period;
  } else {
    var hVal24 = String(hours).padStart(2, '0');
    var mVal24 = String(minutes).padStart(2, '0');

    checkRadio(wrapper, '-hour', hVal24);
    checkRadio(wrapper, '-minute', mVal24);

    input.value = hVal24 + ':' + mVal24;
  }

  // Scroll selected options into view
  scrollSelectedIntoView(wrapper);
}

/**
 * Checks a radio by name suffix and value.
 */
function checkRadio(wrapper, nameSuffix, value) {
  var radio = wrapper.querySelector(
    'input[name$="' + nameSuffix + '"][value="' + value + '"]'
  );
  if (radio) radio.checked = true;
}

/**
 * Scrolls each column so the checked option is visible.
 */
function scrollSelectedIntoView(wrapper) {
  var columns = wrapper.querySelectorAll('.timepicker-column');
  columns.forEach(function (col) {
    var checked = col.querySelector('input:checked');
    if (checked) {
      var label = checked.closest('.timepicker-option');
      if (label) {
        label.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  });
}
