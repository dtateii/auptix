"use strict";

var AuptixConverter = {

  /**
   * Take arbitrary input signals and convert to 
   * logarithmic sonic frequency values.
  */
  logAdapt: function (signal) {

    // Mathing
    // @see http://stackoverflow.com/questions/846221/logarithmic-slider
    // @author: http://stackoverflow.com/users/56338/sth

    // Arbitrary control precision is hardcoded 0-20736 (12^4)
    var minp = 0;
    var maxp = 20736;

    // Output should be between 20 an 20000 (Hz).
    var minv = Math.log(20);
    var maxv = Math.log(20000);

    // Calculate adjustment factor.
    var scale = (maxv - minv) / (maxp - minp);

    return Math.exp(minv + scale * (signal - minp));
  },
  /**
   * @param: num frequency
   *    in Hz
   * @return: num wavelength
   *    in nanometers
   */
  soundToLight: function (frequency) {

    // Convert frequency to wavelength
    // λ = ν / ƒ  ,  ƒ = ν / λ
    // ν sound in air at room temperature is about 340 m/s (@todo make configurable)
    var wavelength = 0;
    var velocity = 340;

    wavelength = velocity / frequency; // λ in meters

    // Maths
    // @see http://stackoverflow.com/questions/846221/logarithmic-slider
    // @author: http://stackoverflow.com/users/56338/sth

    // After converting frequency to wavelength, the value should be between
    // .000017m (20kHz) and 17m (20Hz).
    var minp = 0.000017;
    var maxp = 17;

    // The result should be between 380 an 780.
    var minv = Math.log(380);
    var maxv = Math.log(780);

    // Calculate adjustment factor.
    var scale = (maxv - minv) / (maxp - minp);

    return Math.exp(minv + scale * (wavelength - minp));

  },
  wavelengthToRgb: function (wavelength) {

    // These wavelength values are in nanometers.

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