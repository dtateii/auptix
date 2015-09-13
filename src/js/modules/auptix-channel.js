"use strict";

var CtrlOsc = require('./auptix-ctrl-oscillator');
var CtrlGain = require('./auptix-ctrl-gain');
var CtrlFreq = require('./auptix-ctrl-frequency');
var converter = require('./auptix-converter');

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
  this.ui.className = "channel";
  this.addControl('osc');
  this.addControl('gain');
  this.addControl('freq');
  this.lens = document.createElement('output');
  this.lens.className = "lens";
  this.ui.appendChild(this.lens);
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
      var rgb = converter.wavelengthToRgb(signal);
      var rgbCss = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      this.lens.style.backgroundColor = rgbCss;
    }
  },
};

module.exports = AuptixChannel;
