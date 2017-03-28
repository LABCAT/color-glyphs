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

  if (row === 0) {
    // hue
    var stroke_w = map(column, 0, 4, 1, 3);
    strokeWeight(stroke_w);
    rect(half_size-rect_width/2, half_size-20, rect_width, 40, 20);
  }
  else if (row === 1) {
    // saturation
    var rect_width = map(column, 0, 4, 10, 80);
    rect(half_size-rect_width/2, half_size-20, rect_width, 40, 20);
  }
  else {
    // lightness
    var fill_col = map(column, 0, 4, 30, 90);
    fill(fill_col);
    rect(half_size-rect_width/2, half_size-20, rect_width, 40, 20);
  }
}

// some examples of how to specify a base color
// var my_color = "#d24632"
// var my_color = "rgb(245, 225, 50)"
var my_color = "rgb(20%, 47%, 67%)"

var shapes_should_draw = false;

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
      fill(bg_color);
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
