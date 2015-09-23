"use strict";

var AuptixCtrlFreq = function (channel) {

  // Init control vars.
  var self = this;
  this.channel = channel;

  // Create Freq Ctrl range slider.
  this.range = document.createElement('input');
  this.range.setAttribute('type', 'range');
  this.range.setAttribute('min', '0');
  this.range.setAttribute('max', '20736');
  this.range.setAttribute('value', '0');

  // Create range update event listener, ultimately fires Channel callback.
  this.range.addEventListener('input', function () {
    self.onUpdate();
  });

    // Create Freq Ctrl label.
  this.label = document.createElement('label');
  this.label.innerHTML = 'Frequency';

  // Attach Frequency Control to component ui.
  this.ui = document.createElement('div');
  this.ui.setAttribute('class', 'control');
  this.ui.appendChild(this.label);
  this.ui.appendChild(this.range);
};

// Prototype functions.
AuptixCtrlFreq.prototype = {
  onUpdate: function () {
    this.channel.onFrequencyUpdate(this.range.value);
  },
};

module.exports = AuptixCtrlFreq;
