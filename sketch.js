var canvasWidth = 960;
var canvasHeight = 500;

function setup () {
	// create the drawing canvas, save the canvas element
	var main_canvas = createCanvas(canvasWidth, canvasHeight);
	main_canvas.parent('canvasContainer');

	// this means draw will only be called once
	noLoop();
}

// draw five colors and then five glyphs
function draw () {
	var size=200;
	var xdiff = (width - 4 * size) / 4;
	var xstep = size + xdiff;
	var ydiff = (height - 2 * size) / 2;
	var ystep = size + ydiff;

	background(255, 255, 220);
	noStroke();

	// red
	fill(210, 70, 50);
	rect(xdiff/2 + xstep * 0, ydiff/2 + ystep * 0, size, size);

	// yellow
	fill(245, 225, 50);
	rect(xdiff/2 + xstep * 1, ydiff/2 + ystep * 0, size, size);

	// blue
	fill(50, 120, 170);
	rect(xdiff/2 + xstep * 2, ydiff/2 + ystep * 0, size, size);

	// forest green 
	fill(32, 162, 58);
	rect(xdiff/2 + xstep * 3, ydiff/2 + ystep * 0, size, size);

	resetMatrix();
	fill(0);
	stroke(0);
	// Represent red here
	rect(xdiff/2 + xstep * 0, ydiff/2 + ystep * 1, size, size);
	translate(xdiff/2 + xstep * 0, ydiff/2 + ystep * 1);
	drawRedRepresentation();

	resetMatrix();
	fill(255);
	stroke(0);
	// Represent yellow here
	rect(xdiff/2 + xstep * 1, ydiff/2 + ystep * 1, size, size);
	translate(xdiff/2 + xstep * 1, ydiff/2 + ystep * 1);
	drawYellowRepresentation();
	
	resetMatrix();
	fill(0);
	stroke(0);
	// Represent blue here
	rect(xdiff/2 + xstep * 2, ydiff/2 + ystep * 1, size, size);
	translate(xdiff/2 + xstep * 2, ydiff/2 + ystep * 1);
	drawBlueRepresentation();

	resetMatrix();
	fill(255);
	stroke(0);
	strokeWeight(1);
	// Represent forest green here
	rect(xdiff/2 + xstep * 3, ydiff/2 + ystep * 1, size, size);
	translate(xdiff/2 + xstep * 3, ydiff/2 + ystep * 1);
	drawGreenRepresentation();
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

function drawRedRepresentation(){
	//x and y positions for the 16 triangles
	var positions = {
		'x1': [12.5, 62.5, 112.5, 162.5, 200, 200, 200, 200, 162.5, 112.5, 62.5, 12.5, 0, 0, 0, 0], 
		'x3': [37.5, 87.5, 137.5, 187.5, 200, 200, 200, 200, 187.5, 137.5, 87.5, 37.5, 0, 0, 0, 0],
		'y1': [0, 0, 0, 0, 12.5, 62.5, 112.5, 162.5, 200, 200, 200, 200, 162.5, 112.5, 62.5, 12.5],
		'y3': [0, 0, 0, 0, 37.5, 87.5, 137.5, 187.5, 200, 200, 200, 200, 187.5, 137.5, 87.5, 37.5 ]
	}
	noStroke();
	fill(255, 255, 255, 191);
	ellipse(100, 100, 30, 30);
	fill(255);
	
	
	//draw circle in the center
	ellipse(100, 100, 20, 20);
	
	fill(0);
	ellipse(100, 100, 5, 5);
	
	fill(255, 255, 255, 159);
	
	//draw 16 triangles from the center of the square to the edge 
	for($i = 0; $i < 16; $i++){
		triangle(positions['x1'][$i], positions['y1'][$i], 100, 100, positions['x3'][$i], positions['y3'][$i],);
	}
}

function drawYellowRepresentation(){
	noStroke();
	fill(55,55,55, 127);
	//translate to the center of the square
	translate(100, 100);
	
	//draw 16 circles, rotating a 16th each time
	for($j = 0; $j < 16; $j++){
	  ellipse(0, 15, 20, 160);
	  rotate(PI/8);
	}
}

function drawBlueRepresentation(){
	strokeWeight(3);
	
	//bottom of globe
	fill(200);
	arc(100, 100, 150, 150, 0, PI, PIE);
	
	//top of globe
	fill(245);
	arc(100, 100, 150, 150, PI, 0, PIE);
	
	//center oval
	fill(200, 200, 200, 63);
	ellipse(100, 100, 75, 148);
	
	noFill();
	//top arc
	arc(100, 25, 150, 75, 0+(QUARTER_PI/2), PI-(QUARTER_PI/2), OPEN);
	//bottom arc
	arc(100, 175, 150, 75, PI+(QUARTER_PI/2), 0-(QUARTER_PI/2), OPEN);
}

function drawGreenRepresentation(){
	translate(80, 20);
	noStroke();
	//draw 3 trees in different colours and positions
	for($i = 0; $i < 3; $i++){
		var rgba = Array(60 * $i, 60 * $i, 60 * $i, 255);
		drawTree(rgba);
		translate(-30, 30);
	}
}
/*
 * A collection of triangles and a rectangle combined to represent a tree
 */
function drawTree(rgba = Array(63, 63, 63, 127)){
	fill(rgba[0],rgba[1],rgba[2],rgba[3]);
	triangle(30, 30, 50, 0, 70, 30);
	triangle(20, 50, 50, 14, 80, 50);
	triangle(10, 70, 50, 28, 90, 70);
	triangle(0, 90, 50, 42, 100, 90);
	rect(44, 78, 12, 20);
}
