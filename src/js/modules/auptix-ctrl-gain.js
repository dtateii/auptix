"use strict";

var AuptixCtrlGain = function (channel) {

  // Init control vars.
  var self = this;
  this.channel = channel;

  // Create Gain Ctrl range slider.
  this.range = document.createElement('input');
  this.range.setAttribute('type', 'range');
  this.range.setAttribute('min', '0');
  this.range.setAttribute('max', '88');
  this.range.setAttribute('value', '24');

  // Create range update event listener, ultimately fires Channel callback.
  this.range.addEventListener('input', function () {
    self.onUpdate();
  });

    // Create Gain Ctrl label.
  this.label = document.createElement('label');
  this.label.innerHTML = 'Volume';

  // Attach Gain Control to component ui.
  this.ui = document.createElement('div');
  this.ui.appendChild(this.label);
  this.ui.appendChild(this.range);
};

// Prototype functions.
AuptixCtrlGain.prototype = {
  onUpdate: function () {

    // Osc signal is super loud. Get ratio from control, then attenuate substantially.
    var volume = (this.range.value / 88) / 100;

    // Remove imperceptible precisions.
    var volumeRound = Math.round(volume * 100000) / 100000;

    // console.log("Control value is " + this.range.value + " of 88.");
    // console.log("Calculated gain is " + volume);
    // console.log("Rounded off gain is " + volumeRound);

    this.channel.onGainUpdate(volumeRound);
  },
};

module.exports = AuptixCtrlGain;