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