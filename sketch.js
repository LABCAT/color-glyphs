var canvasWidth = 960;
var canvasHeight = 500;

var glyphSelector;
var modeSelector;
var sizeSelector;
var show_oddball = false;
var oddball_row = 0;
var oddball_col = 0;

var val_sliders = [];
var max_vals = [360, 100, 100];

var curEmoji = 76;
var NUM_EMOJI = 872;
var EMOJI_WIDTH = 38;

var emojiImg;
var curEmojiImg;
var curEmojiPixels;
function preload() {
  emojiImg = loadImage("twemoji36b_montage.png");
}

function setup() {
  // create the drawing canvas, save the canvas element
  var main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  // create two sliders
  for (i=0; i<3; i++) {
    var slider = createSlider(0, 10*max_vals[i], 10*max_vals[i]/2);
    slider.parent("slider" + (i+1) + "Container")
    slider.changed(sliderUpdated);
    slider.mouseMoved(sliderUpdated);
    slider.touchMoved(sliderUpdated);
    val_sliders.push(slider);
  }

  modeSelector = createSelect();
  modeSelector.option('drive');
  modeSelector.option('gradient');
  modeSelector.option('random_grid');
  modeSelector.option('oddball');
  modeSelector.option('image');
  modeSelector.changed(modeChangedEvent);
  modeSelector.value('image');
  modeSelector.parent('selector1Container');

  glyphSelector = createSelect();
  glyphSelector.option('show_color');
  glyphSelector.option('gray');
  glyphSelector.option('spot');
  glyphSelector.changed(modeChangedEvent);
  glyphSelector.value('gray');
  glyphSelector.parent('selector2Container');

  sizeSelector = createSelect();
  sizeSelector.option('32');
  sizeSelector.option('64');
  sizeSelector.option('128');
  sizeSelector.option('256');
  sizeSelector.parent('selector3Container');
  sizeSelector.value('32');
  sizeSelector.changed(sizeChangedEvent);


  guideCheckbox = createCheckbox('', false);
  guideCheckbox.parent('checkContainer');
  guideCheckbox.changed(guideChangedEvent);

  button = createButton('redo');
  button.mousePressed(buttonPressedEvent);
  button.parent('buttonContainer');

  curEmojiImg = createImage(36, 36);
  // create an array for HSB values: [18][18][3]
  curEmojiPixels = Array(18);
  for(var i=0; i<18; i++) {
    curEmojiPixels[i] = Array(18);
    for(var j=0; j<18; j++) {
      curEmojiPixels[i][j] = Array(3);
    }
  }

  gray_glyph = new GrayGlyph();
  spot_glyph = new SpotGlyph();
  colorMode(HSB);
  noLoop();
  refreshGridData();
  modeChangedEvent();
}

function sliderUpdated() {
    redraw();
}

function mouseClicked() {
  if (mouseX > width/4) {
    refreshGridData();
  }
  redraw();
}

function dataInterpolate(data1, data2, val) {
  var d = new Array(8);
  for(var i=0; i<8; i++) {
    d[i] = lerp(data1[i], data2[i], val);
  }
  return d;
}

var numGridRows;
var numGridCols;
var gridValues; // row, col order
var gridOffsetX, gridOffsetY;
var gridSpacingX, gridSpacingY;
// Generate data for putting glyphs in a grid

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function refreshGridData() {
  var mode = modeSelector.value();
  var glyphSize = parseInt(sizeSelector.value(), 10);

  if (mode == "image") {
    if(glyphSize == 32) {
      numGridCols = 18;
      numGridRows = 17;
      gridOffsetX = 320;
      gridSpacingX = 31;
      gridOffsetY = 2;
      gridSpacingY = 29;
    }
    else if(glyphSize == 64) {
      numGridCols = 10;
      numGridRows = 9;
      gridOffsetX = 280;
      gridSpacingX = 66;
      gridOffsetY = -18;
      gridSpacingY = 59;
    }
    else if(glyphSize == 128) {
      numGridCols = 6;
      numGridRows = 5;
      gridOffsetX = 164;
      gridSpacingX = 132;
      gridOffsetY = -50;
      gridSpacingY = 118;
    }
    else if(glyphSize == 256) {
      numGridCols = 3;
      numGridRows = 3;
      gridOffsetX = 172;
      gridSpacingX = 262;
      gridOffsetY = -100;
      gridSpacingY = 234;
    }
  }
  else if(glyphSize == 128) {
    numGridCols = 7;
    numGridRows = 3;
    gridOffsetX = 10;
    gridSpacingX = 136;
    gridOffsetY = 20;
    gridSpacingY = 166;
  }
  else if(glyphSize == 256) {
    numGridCols = 3;
    numGridRows = 1;
    gridOffsetX = 20;
    gridSpacingX = 320;
    gridOffsetY = 100;
    gridSpacingY = 500;
  }
  else if(glyphSize == 64) {
    numGridCols = 14;
    numGridRows = 7;
    gridOffsetX = 3;
    gridSpacingX = 68;
    gridOffsetY = 6;
    gridSpacingY = 71;
  }
  else if(glyphSize == 32) {
    numGridCols = 24;
    numGridRows = 13;
    gridOffsetX = 4;
    gridSpacingX = 40;
    gridOffsetY = 4;
    gridSpacingY = 38;
  }
  gridValues = new Array(numGridRows);
  for (var i=0; i<numGridRows; i++) {
    gridValues[i] = new Array(numGridCols);
    for (var j=0; j<numGridCols; j++) {
      gridValues[i][j] = new Array(8);
    }
  }
  if (mode == "gradient" || mode == 'oddball') {
    var top_left = Array(3);
    var top_right = Array(3);
    var bottom_left = Array(3);
    var bottom_right = Array(3);
    for (var k=0; k<3; k++) {
      top_left[k] = random(max_vals[k]);
      top_right[k] = random(max_vals[k]);
      bottom_left[k] = random(max_vals[k]);
      bottom_right[k] = random(max_vals[k]);
    }
    for (var i=0; i<numGridRows; i++) {
      if(numGridRows == 1) {
        var frac_down = 0;
      }
      else {
        var frac_down = i / (numGridRows - 1.0);
      }
      d_left = dataInterpolate(top_left, bottom_left, frac_down);
      d_right = dataInterpolate(top_right, bottom_right, frac_down);
      for (var j=0; j<numGridCols; j++) {
        if(numGridCols == 0) {
          var frac_over = 0;
        }
        else {
          var frac_over = j / (numGridCols - 1.0);
        }
        gridValues[i][j] = dataInterpolate(d_left, d_right, frac_over);
      }
    }
    if (mode == 'oddball') {
      // replace an entry at random
      oddball_row = Math.floor(random(numGridRows))
      oddball_col = Math.floor(random(numGridCols))
      for (var k=0; k<3; k++) {
        gridValues[oddball_row][oddball_col][k] = random(max_vals[k]);
      }
    }
  }
  else if(mode == "image") {
    for (var i=0; i<numGridRows; i++) {
      for (var j=0; j<numGridCols; j++) {
        for (var k=0; k<3; k++) {
          gridValues[i][j][k] = curEmojiPixels[i][j][k];
        }
      }
    }
  }
  else {
    for (var i=0; i<numGridRows; i++) {
      for (var j=0; j<numGridCols; j++) {
        for (var k=0; k<3; k++) {
          gridValues[i][j][k] = random(max_vals[k]);
        }
      }
    }
  }
}

function sizeChangedEvent() {
  var mode = modeSelector.value();
  if (mode != "drive") {
    refreshGridData();
  }
  redraw();
}

function guideChangedEvent() {
  show_oddball = guideCheckbox.checked();
  redraw();
}

function modeChangedEvent() {
  var mode = modeSelector.value();

  // enable/disable sliders
  if (mode === "drive") {
    // disable the button
    // button.attribute('disabled','');

    // enable the size selector
    sizeSelector.removeAttribute('disabled');

    // enable the first four sliders
    for(var i=0; i<3; i++) {
      val_sliders[i].removeAttribute('disabled');  
    }
  }
  else {
    // enable the button
    // button.removeAttribute('disabled');

    // disable the sliders
    for(var i=0; i<3; i++) {
      val_sliders[i].attribute('disabled','');
    }

    // enable the size selector
    // sizeSelector.removeAttribute('disabled');

    // refresh data
    refreshGridData();
  }
  if (mode === "image") {
    // get current emoji image
    var offsetX = 36 * (curEmoji % 38);
    var offsetY = 36 * Math.floor(curEmoji / 38);

    var squareOffsets = [ [0,0], [0,1], [1,1], [1, 0] ];
    curEmojiImg.copy(emojiImg, offsetX, offsetY, 36, 36, 0, 0, 36, 36);
    curEmojiImg.loadPixels();
    colorMode(RGB);
    for(var i=0; i<17; i++) {
      // i is y
      var maxX = 18;
      var offsetX = 0;
      if (i%2 == 1) {
        maxX = 17;
        offsetX = 1;
      }
      for(var j=0; j<maxX; j++) {
        // j is x
        var sumColor = [0, 0, 0];
        for(var k=0; k<4; k++) {
          // k is summing over 4 adacent pixels
          var curColor = curEmojiImg.get(j*2 + squareOffsets[k][0] + offsetX, 1 + i*2 + squareOffsets[k][1]);
          for(var l=0; l<3; l++) {
            sumColor[l] += curColor[l] / 4.0;
          }
        }
        var curColor = color(sumColor);
        curEmojiPixels[i][j][0] = curColor._getHue();
        curEmojiPixels[i][j][1] = curColor._getSaturation();
        curEmojiPixels[i][j][2] = curColor._getBrightness();
      }
    }
    colorMode(HSB);

    // refresh data
    refreshGridData();
  }

  redraw();
}

function buttonPressedEvent() {
  refreshGridData();
  redraw();
}

var colorBack = "rgb(232, 232, 232)"
var colorFront = "rgb(192, 192, 255)"

function ColorGlyph() {
  this.draw = function(values, size) {
    fill(values[0], values[1], values[2]);
    stroke(0);
    var s2 = size/2;
    ellipse(s2, s2, size);
  }
}
var color_glyph = new ColorGlyph();

function highlightGlyph(glyphSize) {
  halfSize = glyphSize / 2.0;
  stroke(0, 0, 255, 128);
  noFill();
  strokeWeight(4);
  ellipse(halfSize, halfSize, glyphSize+4);
  fill(0);
  strokeWeight(1);
}

function getGyphObject() {
  var glyphMode = glyphSelector.value();
  var glyph_obj = color_glyph;

  if(glyphMode == "gray")
    glyph_obj = gray_glyph;
  else if(glyphMode == "spot")
    glyph_obj = spot_glyph;

  return(glyph_obj);
}

function drawDriveMode() {
  var glyph_obj = getGyphObject();
  var glyphSize = parseInt(sizeSelector.value(), 10);
  var halfSize = glyphSize / 2;

  background(colorBack);
  var halfSize = glyphSize / 2;
  var middle_x = canvasWidth / 2;
  var middle_y = canvasHeight / 2;
  var val = [0,0,0];
  for(i=0; i<3; i++) {
    val[i] = val_sliders[i].value() / 10.0;
  }

  resetMatrix();
  translate(middle_x - halfSize, middle_y - halfSize);
  glyph_obj.draw(val, glyphSize);

  if (show_oddball) {
    resetMatrix();
    translate(middle_x - halfSize, middle_y - halfSize);
    highlightGlyph(glyphSize)
  }

  resetMatrix();
  translate(middle_x + halfSize + 32, middle_y - halfSize);
  color_glyph.draw(val, glyphSize);
}

function drawGridMode() {
  var mode = modeSelector.value();
  var glyph_obj = getGyphObject();

  var glyphSize = parseInt(sizeSelector.value(), 10);
  background(colorBack);
  if (show_oddball &&  mode == 'oddball') {
    resetMatrix();
    translate(gridOffsetX + oddball_col * gridSpacingX, gridOffsetY + oddball_row * gridSpacingY);
    highlightGlyph(glyphSize)
  }
  var hexOffset = (mode == "image");
  for (var i=0; i<numGridRows; i++) {
    var tweakedNumGridCols = numGridCols;
    var offsetX = 0;
    if (hexOffset && i%2 == 1) {
      offsetX = gridSpacingX / 2;
      tweakedNumGridCols = numGridCols - 1;
    }
    for (var j=0; j<tweakedNumGridCols; j++) {
      resetMatrix();
      translate(gridOffsetX + j * gridSpacingX + offsetX, gridOffsetY + i * gridSpacingY);
      glyph_obj.draw(gridValues[i][j], glyphSize);
      resetMatrix();
    }
  }
}

function draw () {
  colorMode(HSB);
  var mode = modeSelector.value();

  if (mode == "drive") {
    drawDriveMode();
  }
  else {
    drawGridMode();
  }
  resetMatrix();
  if (mode == "image") {
    image(curEmojiImg, 32, height-32-36);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
  else if (key == ' ') {
    refreshGridData();
    redraw();
  }
  else if (key == 'f') {
    var curGlyph = glyphSelector.value()
    if(curGlyph == "show_color") {
      glyphSelector.value('gray');
    }
    else if(curGlyph == "gray") {
      glyphSelector.value('spot');
    }
    else if(curGlyph == "spot") {
      glyphSelector.value('show_color');
    }
    redraw();
  }
  else if (key == 's') {
    var old_value = guideCheckbox.checked();
    guideCheckbox.checked(!old_value);
    guideChangedEvent();
  }
  else if (key == '1') {
    sizeSelector.value('32');
    sizeChangedEvent()
  }
  else if (key == '2') {
    sizeSelector.value('64');
    sizeChangedEvent()
  }
  else if (key == '3') {
    sizeSelector.value('128');
    sizeChangedEvent()
  }
  else if (key == '4') {
    sizeSelector.value('256');
    sizeChangedEvent()
  }
  else if (key == 'd') {
    modeSelector.value('drive');
    modeChangedEvent()
  }
  else if (key == 'g') {
    modeSelector.value('gradient');
    modeChangedEvent()
  }
  else if (key == 'r') {
    modeSelector.value('random');
    modeChangedEvent()
  }
  else if (key == 'o') {
    modeSelector.value('oddball');
    modeChangedEvent()
  }
  else if (key == 'i') {
    modeSelector.value('image');
    modeChangedEvent()
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    curEmoji = (curEmoji + NUM_EMOJI - 1) % NUM_EMOJI;
    modeChangedEvent();
  }
  else if (keyCode == RIGHT_ARROW) {
    curEmoji = (curEmoji + 1) % NUM_EMOJI;
    modeChangedEvent();
  }
  else if (keyCode == UP_ARROW) {
    curEmoji = (curEmoji + NUM_EMOJI - 38) % NUM_EMOJI;
    modeChangedEvent();
  }
  else if (keyCode == DOWN_ARROW) {
    curEmoji = (curEmoji + 38) % NUM_EMOJI;
    modeChangedEvent();
  }
}
