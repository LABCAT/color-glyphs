/*
 * val4 is an array of 3 numbers that range from [0,1000]
 * size is the number of pixels for width and height
 * use p5.js to draw a round grawscale glpyh within the bounding box
 */ 
function gray_glyph(values, size) {
  // replace this with your own version

  // map brightness to large circle shade
  var color1 = map(values[2], 0, 100, 10, 70)
  //stroke(color1);
  fill(0);
  var center = size/2;
  ellipse(center, center, size);

  // inner size is set to 30%
  var inner_size = 0.2 + 0.4 * 0.3;
  var s3 = size * inner_size;
  // inner color based on saturation
  var color2 = map(values[1], 0, 100, color1+20, 240)
  fill(color2);
  stroke(color2);

  console.debug(values[2]);
  //saturation dimension
  var saturation = map(values[1], 0, 100, 0, size)

  //brightness dimension
  var brightnessTop = map(values[2], 0, 100, center, 0);
  var brightnessBottom = map(values[2], 0, 100, center, size);


  //outer circle
  fill(255, 255, 255, 47);
  ellipse(center, center, saturation);

  //middle circle
  fill(255);
  ellipse(center, center, saturation / 2);

  //inner circle
  fill(0);
  ellipse(center, center, saturation / 4);
  
  //print('values = ' + values);
  //print('values[0] = ' + values[0]);
  // hue controls left/right shift
  var shift_frac = (values[0] - 180.0) / 180.0;
  //print('shift_frac = ' + shift_frac);
  var max_shift = 0.5 * (size - s3);
  //print('max_shift = ' + max_shift);
  var x_shift = shift_frac * max_shift;
  //ellipse(center + x_shift, center, s3);  

  //translate to the center of the square
  //translate(100, 100);
  var s4 = center - s3;
  //x and y positions for the 16 triangles
  var positions = {
    'x1': [
            center - size/64,
            brightnessBottom,
            center - size/64,
            brightnessTop
          ],
    'y1': [
            brightnessTop,
            center - size/64,
            brightnessBottom,
            center - size/64
          ],
    'x2': [
            center,
            center,
            center,
            center
          ],
    'y2': [
            center,
            center,
            center,
            center
          ],
    'x3': [
            center + size/64,
            brightnessBottom,
            center + size/64,
            brightnessTop
          ],
    'y3': [
            brightnessTop,
            center + size/64,
            brightnessBottom,
            center + size/64
          ]
  }
  //draw 16 circles, rotating a 16th each time
  //print('center = ' + center);
  //print("  x_shift = " + x_shift);
  fill(255, 255, 255, 127);
  noStroke(); 
  for($i = 0; $i < 4; $i++){
    triangle(positions['x1'][$i], positions['y1'][$i], positions['x2'][$i], positions['y2'][$i], positions['x3'][$i], positions['y3'][$i]);
  }
}
