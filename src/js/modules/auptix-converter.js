"use strict";

var AuptixConverter = {

  wavelengthToRgb: function (wavelength) {
    /** taken from:
    http://stackoverflow.com/questions/1472514/convert-light-frequency-to-rgb
    author: http://stackoverflow.com/users/1254880/tarc
    */

    var gamma = 0.80;
    var intensityMax = 255;

    /** Taken from Earl F. Glynn's web page:
    * <a href="http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm">Spectra Lab Report</a>
    * */

    var factor = 0.0;
    var Red = 0;
    var Green = 0;
    var Blue = 0;

    if ((wavelength >= 380) && (wavelength<440)) {
        Red = -(wavelength - 440) / (440 - 380);
        Green = 0.0;
        Blue = 1.0;
    } else if ((wavelength >= 440) && (wavelength<490)) {
        Red = 0.0;
        Green = (wavelength - 440) / (490 - 440);
        Blue = 1.0;
    } else if ((wavelength >= 490) && (wavelength<510)) {
        Red = 0.0;
        Green = 1.0;
        Blue = -(wavelength - 510) / (510 - 490);
    } else if ((wavelength >= 510) && (wavelength<580)) {
        Red = (wavelength - 510) / (580 - 510);
        Green = 1.0;
        Blue = 0.0;
    } else if ((wavelength >= 580) && (wavelength<645)) {
        Red = 1.0;
        Green = -(wavelength - 645) / (645 - 580);
        Blue = 0.0;
    } else if ((wavelength >= 645) && (wavelength<781)) {
        Red = 1.0;
        Green = 0.0;
        Blue = 0.0;
    } else{
        Red = 0.0;
        Green = 0.0;
        Blue = 0.0;
    };

    // Let the intensity fall off near the vision limits

    if ((wavelength >= 380) && (wavelength<420)) {
        factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
    } else if ((wavelength >= 420) && (wavelength<701)) {
        factor = 1.0;
    } else if ((wavelength >= 701) && (wavelength<781)) {
        factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
    } else{
        factor = 0.0;
    };


    var rgb = [];

    // Don't want 0^x = 1 for x <> 0
    rgb[0] = Red == 0.0 ? 0 : Math.round(intensityMax * Math.pow(Red * factor, gamma), 0);
    rgb[1] = Green == 0.0 ? 0 : Math.round(intensityMax * Math.pow(Green * factor, gamma), 0);
    rgb[2] = Blue == 0.0 ? 0 : Math.round(intensityMax * Math.pow(Blue * factor, gamma), 0);

    return rgb;
  },
};

module.exports = AuptixConverter;