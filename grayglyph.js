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
  
  /*
   * I have added additional parameters to this functionality so this function can also be used in the draw function of the SpotGlyph object
   * The additional parameters I have added are as follows:
   * @param {Number}  spot_hue       - value of the hue - a number between 0 and 359
   * @param {Number}  spotMin    	 - minimum hue value that determines whether or not to use the spot_hue - a number between 0 and 359
   * @param {Number}  spotMax   	 - maximum hue value that determines whether or not to use the spot_hue - a number between 0 and 359
   */
  this.draw = function(values, size, spot_hue = 0, spotMin = 0, spotMax = 0) {
    //determine the center of the circle
    var center = size/2;

    //value of the hue dimension
    var hueDegree = floor(values[0]) % 360;

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
	//JSON object containing the different values for the three circles drawn to represent the saturation dimension
	var satCircles = {
		'brightness' : [
					0,
					100,
					0
				],
		'alpha' : [
					0.1875,
					0.625,
					0.375
				],
		'size' : [
					circleSize,
					circleSize/2,
					circleSize/4,
				]
	}

    //variables created by the brightness dimension
    var brightnessTrans = map(values[2], 0, 100, 0.9, 0);
    var hueColour = map(values[2], 0, 100, 100, 0);
    var hueTrans = map(values[2], 100, 0, 0.9, 0.1);

    //set up the JSON objects used to store all the x and y positions of the triangles that will be drawn when this is passed to the drawStar function
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
	
	//draw the circles that represent the saturation dimension
    stroke(0);
	for(var i = 0; i < 3; i++){
		fill(0, 0,satCircles['brightness'][i], satCircles['alpha'][i]);
		ellipse(center, center, satCircles['size'][i]);
	}
    
    //draw the hexagon that represents the brightness dimension
    fill(0, 0, 0, brightnessTrans);
    hexagon(center, center, size/2);
	
	//draw the stars that represent the hue dimension
    noStroke();
	angleMode(DEGREES);
    translate(center, center);    
    rotate(hueDegree);
    
	var hsba = Array(0, 0, 100, hueTrans);

	//if the draw function has been passed a value for spot_hue we may want to change the values of the hsba array
	if(spot_hue){
		//if hueDegree is within the required range then use it as the hue value in the hsba array
		if(hueDegree <= spotMax && hueDegree >= spotMin){
			hsba = Array(spot_hue, 100, 100, hueTrans);
		}
		//if spotMin is greater than spotMax then the above comparison won't work
		//instead compare if the hueDegree is greater than spotMax or less than spotMin
		if(spotMin > spotMax){
			if(hueDegree <= spotMax || hueDegree >= spotMin) {
				hsba = Array(spot_hue, 100, 100, hueTrans);
			}
		}
		
    }
	
	drawStar(Array(0, 0, hueColour, 0.9), positions, 3);
    translate(-center, -center);
	drawStar(hsba, positions);
  }
}

/*
 * function to draw a hexagon shape
 * adapted from: https://p5js.org/examples/form-regular-polygon.html
 * @param {Number} x       	- x-coordinate of the hexagon
 * @param {Number} y    	- y-coordinate of the hexagon
 * @param {Number} radius   - radius of the hexagon
 */
function hexagon(x, y, radius) {
  angleMode(RADIANS);
  var angle = TWO_PI / 8;
  beginShape();
  for (var a = TWO_PI/16; a < TWO_PI + TWO_PI/16; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/*
 * function to draw the 8 triangles that repressnt the hue dimension
 * the colour and transparency level of the triangles is also affected by the brightness dimension
 * @param {Array}  hsba       		- Array of values used to set the values for the fill function
 * @param {Object} positions    	- Object containing all the x and y positions of the 8 triangles that make up the star
 * @param {Number} sizeReducer   	- Variable that allows the star to drawn at smaller size, should be greater than 1
 */
function drawStar(hsba, positions, sizeReducer = 1) {
	fill(hsba[0], hsba[1], hsba[2], hsba[3]);
	for($i = 0; $i < 8; $i++){
	  triangle(positions['x1'][$i]/sizeReducer, positions['y1'][$i]/sizeReducer, positions['x2'][$i]/sizeReducer, positions['y2'][$i]/sizeReducer, positions['x3'][$i]/sizeReducer, positions['y3'][$i]/sizeReducer);
    }
}

 