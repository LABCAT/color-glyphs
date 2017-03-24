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

  stroke(0);
  noFill();
  // Represent red here
  rect(xdiff/2 + xstep * 0, ydiff/2 + ystep * 1, size, size);


  // Represent yellow here
  rect(xdiff/2 + xstep * 1, ydiff/2 + ystep * 1, size, size);
  noStroke();
  translate(xdiff/2 + xstep * 1, ydiff/2 + ystep * 1);
  fill(55,55,55, 127);
  translate(30, 30);
  for($i = 0; $i < 16; $i++){
    for($j = 0; $j < 10; $j++){
      ellipse(0, 10, 10, 40);
      rotate(PI/5);
    }
    translate(47.5, 0);
    if($i % 4== 3){
      translate(-190, 47);
    }
  }
  resetMatrix();

  // Represent blue here
  fill(0);
  stroke(0);
  rect(xdiff/2 + xstep * 2, ydiff/2 + ystep * 1, size, size);
  translate(xdiff/2 + xstep * 2, ydiff/2 + ystep * 1);
  fill(200);
  arc(100, 100, 100, 100, 0, PI, PIE);
  fill(245);
  arc(100, 100, 100, 100, PI, 0, PIE);
  fill(200, 200, 200, 127);
  ellipse(100, 100, 50, 100);
  noFill();
  arc(100, 50, 100, 50, 0+(QUARTER_PI/2), PI-(QUARTER_PI/2), OPEN);
  arc(100, 150, 100, 50, PI+(QUARTER_PI/2), 0-(QUARTER_PI/2), OPEN);
  

  resetMatrix();
  noFill();
  stroke(0);
  rect(xdiff/2 + xstep * 3, ydiff/2 + ystep * 1, size, size);
  translate(xdiff/2 + xstep * 3, ydiff/2 + ystep * 1);
  noStroke();
  for($i = 0; $i < 16; $i++){
    drawTree();
    translate(50, 0);
    if($i % 4== 3){
      translate(-200, 49);
    }
  }

}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

function drawTree(){
  fill(153, 153, 153, 127);
  triangle(15, 15, 25, 0, 35, 15);
  triangle(10, 25, 25, 7, 40, 25);
  triangle(5, 35, 25, 14, 45, 35);
  triangle(0, 45, 25, 21, 50, 45);
  rect(22, 44, 6, 10);
}
