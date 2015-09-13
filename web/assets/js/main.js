(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Auptix = function () {

  var AuptixChannel = require('./modules/auptix-channel'),
    audioContext,
    board;

  // Create a master audio context.
  audioContext = new AudioContext();

  // Create an initial Channel Strip.
  board = document.getElementById('board');

  // QaD add multiple isolated Channels to the board.
  var addChannel = function () {
    var auptixChannel = new AuptixChannel(audioContext);
    board.appendChild(auptixChannel.ui);
  };

  addChannel();
  addChannel();
};

// Init.
document.addEventListener("DOMContentLoaded", function () {
  var auptix = new Auptix();
  console.log(auptix);
});
},{"./modules/auptix-channel":2}],2:[function(require,module,exports){
"use strict";

var CtrlOsc = require('./auptix-ctrl-oscillator');
var CtrlGain = require('./auptix-ctrl-gain');
var CtrlFreq = require('./auptix-ctrl-frequency');

// Constructor
var AuptixChannel = function (audioContext) {

  // Initialize Channel properties.
  this.audioContext = audioContext;
  this.gainNode = {};
  this.oscillator = {};
  this.ctrlOscillator = {};
  this.ctrlGain = {};
  this.ctrlFrequency = {};

  // Just need one gain node.....initially.
  this.initGain();

  // Add Channel control components.
  this.ui = document.createElement('div');
  this.addControl('osc');
  this.addControl('gain');
  this.addControl('freq');

};

// Prototype functions.
AuptixChannel.prototype = {
  addControl: function (ctrlName) {
    switch (ctrlName) {
    case 'osc':
      // Create Oscillator Control, give Channel.
      this.ctrlOscillator = new CtrlOsc(this);
      this.ui.appendChild(this.ctrlOscillator.ui);
      break;
    case 'gain':
      // Create Gain Control, give Channel.
      this.ctrlGain = new CtrlGain(this);
      this.ui.appendChild(this.ctrlGain.ui);
      break;
    case 'freq':
      // Create Frequency Control, give Channel.
      this.ctrlFrequency = new CtrlFreq(this);
      this.ui.appendChild(this.ctrlFrequency.ui);
      break;
    }
  },
  initGain: function () {
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.005;
  },
  onGainUpdate: function (signal) {
    this.gainNode.gain.value = signal;
  },
  addOscillator: function () {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = this.ctrlFrequency.range.value;
    this.oscillator.connect(this.gainNode);
  },
  removeOscillator: function () {
    delete this.oscillator;
    this.oscillator = {};
  },
  onOscillatorStart: function () {
    // Oscillator can only actually start once.
    // When "starting", create and start new osc.
    this.addOscillator();
    this.oscillator.start();
  },
  onOscillatorStop: function () {
    // Oscillator can only actually start once.
    // When "stopping", stop and destroy osc.
    this.oscillator.stop();
    this.removeOscillator();
  },
  onFrequencyUpdate: function (signal) {
    if (this.oscillator.frequency === undefined) {
      console.log('Oscillator unhooked.');
    } else {
      this.oscillator.frequency.value = signal;
    }
  },
};

module.exports = AuptixChannel;

},{"./auptix-ctrl-frequency":3,"./auptix-ctrl-gain":4,"./auptix-ctrl-oscillator":5}],3:[function(require,module,exports){
"use strict";

var AuptixCtrlFreq = function (channel) {

  // Init control vars.
  var self = this;
  this.channel = channel;

  // Create Freq Ctrl range slider.
  this.range = document.createElement('input');
  this.range.setAttribute('type', 'range');
  this.range.setAttribute('min', '20');
  this.range.setAttribute('max', '20000');
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}]},{},[1]);
