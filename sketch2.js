var canvasWidth = 960;
var canvasHeight = 500;

function setup () {
  // create the drawing canvas, save the canvas element
  var main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  colorMode(HSL, 100);  // Use HSB with scale of 0-100
  // this means draw will only be called once
  noLoop();
}

function draw_shape(column, row, size, cur_color) {
  // replace this with your own logic
  var half_size = size/2;

  // defaults
  fill(60);
  strokeWeight(2);
  var rect_width = 60;
  //this array will be used to set the level of opacity for the trianles and largest ellipse
  var opacityLevel = [47, 47, 47, 47, 47];
  //this variable will be used to reduce the width of triangles that create the rays of the sun
  var triWidthReducer = 2;
  //this variable will be used to increase the size of the elipses in the center
  var scaleMultiplier = 2;
  if (row === 0) {
    // hue
    opacityLevel = [15, 31, 47, 63, 79];
    triWidthReducer = 2;
    scaleMultiplier = 2;
  }
  else if (row === 1) {
    // saturation
    opacityLevel = [47, 47, 47, 47, 47];
    triWidthReducer = 2;
    scaleMultiplier = map(column, 0, 4, 6, 2);
  }
  else {
    // lightness
    opacityLevel = [47, 47, 47, 47, 47];
    triWidthReducer = map(column, 0, 4, 6, -2);
    scaleMultiplier = 2;
  }


  //x and y positions for the 16 triangles
  var positions = {
    'x1': [6 + triWidthReducer, 35.5 + triWidthReducer, 65 + triWidthReducer, 94.5 + triWidthReducer, 120, 120, 120, 120, 94.5 + triWidthReducer, 65 + triWidthReducer, 35.5 + triWidthReducer, 6 + triWidthReducer, 0, 0, 0, 0],
    'x3': [25.5 - triWidthReducer, 55 - triWidthReducer, 84.5 - triWidthReducer, 114 - triWidthReducer, 120, 120, 120, 120, 114 - triWidthReducer, 84.5 - triWidthReducer, 55 - triWidthReducer, 25.5 - triWidthReducer, 0, 0, 0, 0],
    'y1': [0, 0, 0, 0, 6 + triWidthReducer, 35.5 + triWidthReducer, 65 + triWidthReducer, 94.5 + triWidthReducer, 120, 120, 120, 120, 94.5 + triWidthReducer, 65 + triWidthReducer, 35.5 + triWidthReducer, 6 + triWidthReducer],
    'y3': [0, 0, 0, 0, 25.5 - triWidthReducer, 55 - triWidthReducer, 84.5 - triWidthReducer, 114 - triWidthReducer, 120, 120, 120, 120, 114 - triWidthReducer, 84.5 - triWidthReducer, 55 - triWidthReducer, 25.5 - triWidthReducer]
  }
  //circles to represent the sun
  noStroke();
  //outer circle
  fill(255, 255, 255, opacityLevel[column]);
  ellipse(60, 60, 12 * scaleMultiplier, 12 * scaleMultiplier);

  //middle circle
  fill(255);
  ellipse(60, 60, 6 * scaleMultiplier, 6 * scaleMultiplier);

  //inner circle
  fill(0);
  ellipse(60, 60, 3 * scaleMultiplier, 3 * scaleMultiplier);

  //triangles to represent the sun rays
  //draw 16 triangles from the center of the square to the edge
  fill(255, 255, 255, opacityLevel[column]);
  for($i = 0; $i < 16; $i++){
    triangle(positions['x1'][$i], positions['y1'][$i], 60, 60, positions['x3'][$i], positions['y3'][$i]);
  }
}

// some examples of how to specify a base color
// var my_color = "#d24632"
// var my_color = "rgb(245, 225, 50)"
//var my_color = "rgb(20%, 47%, 67%)"

//the base colour I have chosen, a slight variation
//of the red colour from the previous part of the assignment
var my_color = "rgb(208, 11, 11)"

var shapes_should_draw = true;

// draw five colors and then five glyphs
function draw () {
  var size=120;
  var xsteps = 5;
  var xdiff = (width - xsteps * size) / xsteps;
  var xstep = size + xdiff;
  var ysteps = 3;
  var ydiff = (height - ysteps * size) / ysteps;
  var ystep = size + ydiff;

  var bg_color = color("#ffffdc");
  var base_color = color(my_color);
  var base_hue = hue(base_color);
  var base_sat = saturation(base_color);
  var base_lgt = lightness(base_color);

  background(bg_color);
  noStroke();

  for (var x=0; x<xsteps; x++) {
    for (var y=0; y<ysteps; y++) {
      var cur_color = base_color;

      if (y == 0) {
        // hue
        var cur_hue = (85 + base_hue + 100 * 0.3 * x / xsteps) % 100;
        cur_color = color(cur_hue, base_sat, base_lgt);
      }
      else if (y == 1) {
        // saturation
        var cur_sat = (5 + 90 * x / xsteps);
        cur_color = color(base_hue, cur_sat, base_lgt);
      }
      else if (y == 2) {
        // lightness
        var cur_lgt = (5 + 90 * x / xsteps);
        cur_color = color(base_hue, base_sat, cur_lgt);
      }

      fill(cur_color);
      noStroke();
      rect(xdiff/2 + xstep * x - 10, ydiff/2 + ystep * y - 10, size, size);

      strokeWeight(2);
      stroke(0);
      fill(0);
      var curx = xdiff/2 + xstep * x + 10;
      var cury = ydiff/2 + ystep * y + 10;
      rect(curx, cury, size, size);

      if (shapes_should_draw) {
        push();
        translate(curx, cury);
        draw_shape(x, y, size, cur_color);
        pop();
      }
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
