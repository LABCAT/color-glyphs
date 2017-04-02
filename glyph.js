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

  //hue dimension
  var hueMin = map(values[0], 0, 360, center, 0);
  var hueMax = map(values[0], 0, 360, center, size);
  
  //saturation dimension
  var saturation = map(values[1], 0, 100, size, 0)

  //hue dimension
  var brightnessMin = map(values[2], 0, 100, center, (0 + size/8 + size/32));
  var brightnessMax = map(values[2], 0, 100, center, (size - size/8 - size/32));
  


  //outer circle
  fill(255, 255, 255, 47);
  ellipse(center, center, saturation);

  //middle circle
  fill(255, 255, 255, 159);
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
            center - size/32,
            center - size/32,
            center,
            center + size/32,
            center - size/32,
            center - size/32,
            center,
            center + size/32,
          ],
    'y1': [
            center,
            center - size/32,
            center - size/32,
            center - size/32,
            center,
            center - size/32,
            center - size/32,
            center - size/32
          ],
    'x2': [
            center,
            brightnessMax,
            hueMax,
			brightnessMax,
            center,
            brightnessMin,
            hueMin,
            brightnessMin
          ],
    'y2': [
            hueMin,
            brightnessMin,
            center,
			brightnessMax,
            hueMax,
            brightnessMax,
            center,
            brightnessMin
          ],
    'x3': [
            center + size/32,
            center + size/32,
            center,
            center - size/32,
            center + size/32,
            center + size/32,
            center,
            center - size/32
          ],
    'y3': [
            center,
            center + size/32,
            center + size/32,
            center + size/32,
            center,
            center + size/32,
            center + size/32,
            center + size/32
          ]
  }
   

  //draw 16 circles, rotating a 16th each time
  //print('center = ' + center);
  //print("  x_shift = " + x_shift);
  fill(255, 255, 255, 127);
  //fill(255, 0, 0);
  noStroke(); 
  for($i = 0; $i < 16; $i++){
    triangle(positions['x1'][$i], positions['y1'][$i], positions['x2'][$i], positions['y2'][$i], positions['x3'][$i], positions['y3'][$i]);
  }
}
