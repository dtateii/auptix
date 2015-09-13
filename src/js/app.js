"use strict";

var Auptix = function () {

  var AuptixChannel = require('./modules/auptix-channel'),
    audioContext,
    board,
    btnAddChannel;

  // Create a master audio context.
  audioContext = new AudioContext();

  // Create an initial Channel Strip.
  board = document.getElementById('board');

  // Append Channel UI to board
  var addChannel = function () {
    var auptixChannel = new AuptixChannel(audioContext);
    board.appendChild(auptixChannel.ui);
  };

  // Button to add new channels.
  btnAddChannel = document.getElementById('add-channel');
  btnAddChannel.addEventListener('mousedown', function () {
    addChannel();
  });

};

// Init.
document.addEventListener("DOMContentLoaded", function () {
  var auptix = new Auptix();
  console.log(auptix);
});