function GrayGlyph() {
  /*
   * values is an array of 3 numbers: [hue, saturation, brightness]
   *   + hue ranges from 0..360
   *   + saturation ranges from 0..100
   *   + brightness ranges from 0..100
   * this matches the default range for p5.js colorMode(HSB) as describe at:
   *   https://p5js.org/reference/#/p5/colorMode
   *
   * size is the number of pixels for width and height
   *
   * use p5.js to draw a round grayscale glpyh
   * the glyph should stay within the bounding box [0, 0, width, height]
   * this is a grayscale glyph, so only brighness can be adjusted.
   * the range for brighness is 0..100
   *
   * the color mode will be HSB, so you can either:
   *    + use a one argument grayscale call; this is easiest. examples:
   *       - fill(50);    // ranges from 0-100
   *       - stroke(100); // white
   *    + use a three arguement HSB call with values but set both H and S to 0. examples:
   *       - fill(0, 0, 51);    // equivalent to above
   *       - stroke(0, 0, 100); //
   */ 
  this.draw = function(values, size) {
    // replace this with your own version

    // map brightness to large circle shade
    var color1 = map(values[2], 0, 100, 10, 70)
    stroke(color1);
    fill(color1)
    var s2 = size/2;
    ellipse(s2, s2, size);

    // inner size is set to 30%
    var inner_size = 0.2 + 0.4 * 0.3;
    var s3 = size * inner_size;

    // inner color based on saturation
    var color2 = map(values[1], 0, 100, color1+20, 240)
    fill(color2);
    stroke(color2);

    // hue controls left/right shift
    var shift_frac = (values[0] - 180.0) / 180.0;
    var max_shift = 0.5 * (size - s3);
    var x_shift = shift_frac * max_shift;
    ellipse(s2 + x_shift, s2, s3);  
  }  
}
