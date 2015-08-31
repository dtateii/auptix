"use strict";

var AuptixCtrlOsc = function (channel) {

  // Init control vars.
  var self = this;
  this.channel = channel;
  this.state = 0;

  // Create Oscillator Control UI
  this.ui = document.createElement('div');
  this.osc = document.createElement('button');
  this.osc.innerHTML = 'Start';

  // Trigger Parent Channel Oscillator on/off.
  this.osc.addEventListener('mousedown', function () {
    self.toggle();
  });

  // Attach Oscillator Control to component ui.
  this.ui.appendChild(this.osc);
};

// Prototype functions.
AuptixCtrlOsc.prototype = {
  toggle: function () {
    if (0 === this.state) {
      this.state = 1;
      this.osc.innerHTML = 'Stop';
      this.channel.onOscillatorStart();
    } else {
      this.state = 0;
      this.osc.innerHTML = 'Start';
      this.channel.onOscillatorStop();
    }
  },
};

module.exports = AuptixCtrlOsc;