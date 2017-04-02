/*
 * val4 is an array of 3 numbers that range from [0,1000]
 * size is the number of pixels for width and height
 * use p5.js to draw a round grawscale glpyh within the bounding box
 */ 
function gray_glyph(values, size) {
  fill(0);
  var center = size/2;
  ellipse(center, center, size);

  //hue dimension
  var hueDegree = floor(values[0]);
  var hueModulo = (hueDegree % 12) * 4;
  var hue = map(hueDegree, 0, 360, size, 0 + size/16);
  
  //saturation dimension
  var saturationMin = map(values[1], 0, 100, center, 0);
  var saturationMax = map(values[1], 0, 100, center, size);
  
  //hue dimension
  var brightnessMin = map(values[2], 0, 100, center, (0 + size/8 + size/32));
  var brightnessMax = map(values[2], 0, 100, center, (size - size/8 - size/32));
  


  stroke(255);
  
  //outer circle
  fill(255, 255, 255, 47 + hueModulo);
  ellipse(center, center, hue);

  //middle circle
  fill(255, 255, 255, 159 + hueModulo);
  ellipse(center, center, hue / 2);

  //inner circle
  fill(0);
  ellipse(center, center, hue / 4);

  //x and y positions for the 8 triangles
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
            saturationMax,
			brightnessMax,
            center,
            brightnessMin,
            saturationMin,
            brightnessMin
          ],
    'y2': [
            saturationMin,
            brightnessMin,
            center,
			brightnessMax,
            saturationMax,
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
   
  fill(255, 255, 255, 127);
  noStroke(); 
  for($i = 0; $i < 8; $i++){
    triangle(positions['x1'][$i], positions['y1'][$i], positions['x2'][$i], positions['y2'][$i], positions['x3'][$i], positions['y3'][$i]);
  }
}
