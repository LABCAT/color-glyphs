/*
 * val4 is an array of 3 numbers that range from [0,1000]
 * size is the number of pixels for width and height
 * use p5.js to draw a round grawscale glpyh within the bounding box
 */ 
function gray_glyph(values, size) {
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
