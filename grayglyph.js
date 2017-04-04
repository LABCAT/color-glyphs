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
    //determine the center of the circle
    var center = size/2;
    

    //hue dimension
    var hueDegree = floor(values[0]) % 360;
    //a modulo variable used to provide slight variation in the transparency levels of the ellipses that represent the hue dimension
    var hueModulo = (hueDegree % 12);
    var hueHex = map(values[1], 0, 50, 0 + size/16, size);
    var hueCircle = map(values[1], 100, 0, size, 0 + size/16);
    
    //saturation dimension
    //saturationMin and saturationMax are values that determine the positions for the alternating points (between the center of a circle and its edge) of the triangles representing the saturation dimension 
    var saturationMin = map(hueDegree, 0, 179, center, 0);
    var saturationMax = map(hueDegree, 0, 179, center, size);
    if(hueDegree > 179) {
		saturationMin = 0;
		saturationMax = size;
	}
    //brightness dimension
    //brightnessMin and brightnessMax are values that determine the position for the alternating points (between the center of a circle and its edge) of the triangles representing the brightness dimension 
    var brightnessMin = map(hueDegree, 359, 180, (0 + size/8 + size/32), center);
    var brightnessMax = map(hueDegree, 359, 180, (size - size/8 - size/32), center);


    //draw the circles that represent the hue dimension
    stroke(0);
	
    //ellipse(center, center, size);
   
    
    //outer circle
    fill(0, 0, 100, 0.1875 + hueModulo * 0.015625);
    ellipse(center, center, hueCircle);


    //middle circle
    fill(0, 0, 100, 0.625 + hueModulo * 0.015625);
	ellipse(center, center, hueCircle / 2);
	ellipse(center, center, hueCircle / 2, TWO_PI/16);

    // //inner circle
    fill(0);
	ellipse(center, center, hueCircle / 4);

    //JSON objects used to store all the x and y positions of the triangles that represent the saturation and brightness dimensions 
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
     var fillC = map(values[2], 0, 100, 100, 0);
    var fillT = map(values[2], 0, 100, 0.9, 0);
    var fillH = map(values[2], 100, 0, 0.9, 0.1);
    //draw a black background for the glyphs area
    fill(0, 0, 0, fillT);
    hexagon(center, center, size/2, 8, TWO_PI/16);
	
    //draw the 8 triangles that represnt the saturation and brightness dimensions
    //fill(0, 0, fillC, 0.5 + (hueModulo  * 0.015625 * 2));
    fill(0, 0, fillC, fillH);
    noStroke();
    for($i = 0; $i < 8; $i++){
      triangle(positions['x1'][$i], positions['y1'][$i], positions['x2'][$i], positions['y2'][$i], positions['x3'][$i], positions['y3'][$i]);
    }
	
	
  }  
}

function hexagon(x, y, radius, npoints, rotation) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = rotation; a < TWO_PI + rotation; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
