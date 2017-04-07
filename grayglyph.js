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

    //value of the hue dimension
    var hueDegree = floor(values[0]) % 360;
    //a modulo variable used to provide slight variation in the transparency levels of the ellipses that represent the hue dimension
    var hueModulo = (hueDegree % 12);

    //horiVertMin and horiVertMax are values that determine the positions for the alternating points (between the center of a circle and its edge)
    //of the vertical and horizontal triangles used to represent the hue dimension
    var horiVertMin = map(hueDegree, 0, 179, center, 0);
    var horiVertMax = map(hueDegree, 0, 179, center, size);
    if(hueDegree > 179) {
        horiVertMin = 0;
        horiVertMax = size;
    }

    //diagonalMin and diagonalMax are values that determine the position for the alternating points (between the center of a circle and its edge)
    //of the diagonal triangles representing the hue dimension
    var diagonalMin = map(hueDegree, 359, 180, (0 + size/8 + size/32), center);
    var diagonalMax = map(hueDegree, 359, 180, (size - size/8 - size/32), center);

    //variables created by the saturation dimension
    var circleSize = map(values[1], 100, 0, size, 0 + size/16);

    //variables created by the brightness dimension
    var brightnessTrans = map(values[2], 0, 100, 0.9, 0);
    var hueColour = map(values[2], 0, 100, 100, 0);
    var hueTrans = map(values[2], 100, 0, 0.9, 0.1);

    //draw the circles that represent the saturation dimension
    //transparency is affected by the value of the hueModulo variable

    stroke(0);

    //outer circle
    fill(0, 0, 0, 0.1875);
    ellipse(center, center, circleSize);

    //middle circle
    fill(0, 0, 100, 0.625);
    ellipse(center, center, circleSize / 2);

    // //inner circle
    fill(0, 0, 0, 0.375);
    ellipse(center, center, circleSize / 4);

    //draw the hexagon that represents the brightness dimension
    fill(0, 0, 0, brightnessTrans);
    hexagon(center, center, size/2);

    //JSON objects used to store all the x and y positions of the triangles that represent the hue dimension
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
              diagonalMax,
              horiVertMax,
              diagonalMax,
              center,
              diagonalMin,
              horiVertMin,
              diagonalMin
            ],
      'y2': [
              horiVertMin,
              diagonalMin,
              center,
              diagonalMax,
              horiVertMax,
              diagonalMax,
              center,
              diagonalMin
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

    angleMode(DEGREES);
    translate(center, center);
    //draw the 8 triangles that repressnt the hue dimension
    //the colour and transparency level of the triangles is also affected by the brightness dimension
    noStroke();
    fill(0, 0, hueColour, 0.9);
    rotate(hueDegree);
    for($i = 0; $i < 8; $i++){
      triangle(positions['x1'][$i]/3, positions['y1'][$i]/3, positions['x2'][$i]/3, positions['y2'][$i]/3, positions['x3'][$i]/3, positions['y3'][$i]/3);
    }

    translate(-center, -center);
    //draw the 8 triangles that repressnt the hue dimension
    //the colour and transparency level of the triangles is also affected by the brightness dimension
    
    fill(0, 0, 100, hueTrans);
    for($i = 0; $i < 8; $i++){
        triangle(positions['x1'][$i], positions['y1'][$i], positions['x2'][$i], positions['y2'][$i], positions['x3'][$i], positions['y3'][$i]);
    }
    // translate(center, center);
    // //draw the 8 triangles that repressnt the hue dimension
    // //the colour and transparency level of the triangles is also affected by the brightness dimension
    // fill(0, 0, 0, 50);
    // rotate(hueDegree);
    // for($i = 0; $i < 8; $i++){
    //   triangle(positions['x1'][$i]/3, positions['y1'][$i]/3, positions['x2'][$i]/3, positions['y2'][$i]/3, positions['x3'][$i]/3, positions['y3'][$i]/3);
    // }
    angleMode(RADIANS);

  }
}
/*
 * function to draw a hexagon shape
 * adapted from: https://p5js.org/examples/form-regular-polygon.html
 */
function hexagon(x, y, radius, rotation) {
  var angle = TWO_PI / 8;
  beginShape();
  for (var a = TWO_PI/16; a < TWO_PI + TWO_PI/16; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
