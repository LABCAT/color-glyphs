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
function setup () {
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
  // modeSelector.option('analogy');
  modeSelector.option('random_grid');
  modeSelector.option('oddball');
  modeSelector.changed(modeChangedEvent);
  modeSelector.value('oddball');
  modeSelector.parent('selector1Container');

  glyphSelector = createSelect();
  glyphSelector.option('color');
  glyphSelector.option('glyph');
  glyphSelector.changed(modeChangedEvent);
  glyphSelector.value('glyph');
  glyphSelector.parent('selector2Container');

  sizeSelector = createSelect();
  sizeSelector.option('64');
  sizeSelector.option('128');
  sizeSelector.option('256');
  sizeSelector.parent('selector3Container');
  sizeSelector.value('64');
  sizeSelector.changed(sizeChangedEvent);


  guideCheckbox = createCheckbox('', false);
  guideCheckbox.parent('checkContainer');
  guideCheckbox.changed(guideChangedEvent);

  button = createButton('redo');
  button.mousePressed(buttonPressedEvent);
  button.parent('buttonContainer');

  noLoop();
  refreshGridData();
  modeChangedEvent();
}

function sliderUpdated() {
    redraw();
}

function mouseClicked() {
  analogyCycleStep = (analogyCycleStep + 1) % 3;
  if(analogyCycleStep == 0) {
    refreshAnalogyData();
  }
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

var numAnalogyChoices = 5;
var analogyValues = new Array(4);
var analogyChoices = new Array(numAnalogyChoices);
var analogyAnswer;
var analogyCycleStep;

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function refreshAnalogyData() {
  for (var i=0; i<4; i++) {
    analogyValues[i] = new Array(8);
  }
  for (var i=0; i<3; i++) {
    for (var j=0; j<8; j++) {
      analogyValues[i][j] = random(100);
    }
  }
  for (var j=0; j<8; j++) {
    analogyValues[3][j] = clamp(analogyValues[1][j] - analogyValues[0][j] + analogyValues[2][j], 0, 100);
    // handle overflow
    analogyValues[1][j] = clamp(analogyValues[3][j] - analogyValues[2][j] + analogyValues[0][j], 0, 100);
  }
  analogyAnswer = Math.floor(random(numAnalogyChoices))
  for (var i=0; i<numAnalogyChoices; i++) {
    analogyChoices[i] = new Array(8);
    for (var j=0; j<8; j++) {
      if (i == analogyAnswer) {
        analogyChoices[i][j] = analogyValues[3][j];
      }
      else {
        analogyChoices[i][j] = random(100);
      }
    }
  }
  analogyCycleStep = 0;
}

function refreshGridData() {
  var glyphSize = parseInt(sizeSelector.value(), 10);

  if(glyphSize == 128) {
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
  gridValues = new Array(numGridRows);
  for (var i=0; i<numGridRows; i++) {
    gridValues[i] = new Array(numGridCols);
    for (var j=0; j<numGridCols; j++) {
      gridValues[i][j] = new Array(8);
    }
  }
  var mode = modeSelector.value();
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
      if(numGridRows == 0) {
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
  else {
    for (var i=0; i<numGridRows; i++) {
      for (var j=0; j<numGridCols; j++) {
        for (var k=0; k<3; k++) {
          gridValues[i][j][k] = random(max_vals[k]);
        }
      }
    }
  }
  refreshAnalogyData();
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
  var glyph = glyphSelector.value();

  // enable/disable sliders
  if (mode === "drive") {
    // disable the button
    // button.attribute('disabled','');

    // enable the size selector
    sizeSelector.removeAttribute('disabled');

    // enable the first four sliders
    for(i=0; i<3; i++) {
      val_sliders[i].removeAttribute('disabled');  
    }
  }
  else {
    // enable the button
    // button.removeAttribute('disabled');

    // disable the sliders
    for(i=0; i<3; i++) {
      val_sliders[i].attribute('disabled','');
    }

    if (mode == "analogy") {
      // enable the size selector
      sizeSelector.attribute('disabled','');
    }
    else {
      // enable the size selector
      sizeSelector.removeAttribute('disabled');
    }

    // refresh data
    refreshGridData();
  }
  redraw();
}

function buttonPressedEvent() {
  // analogyCycleStep = 0;
  refreshGridData();
  redraw();
}

var colorBack = [232, 232, 232];
var colorFront = [192, 192, 255];

function color_glyph(values, size) {
  colorMode(HSB);
  fill(values[0], values[1], values[2]);
  stroke(0);
  var s2 = size/2;
  ellipse(s2, s2, size);
  colorMode(RGB);
}

function highlightGlyph(glyphSize) {
  halfSize = glyphSize / 2.0;
  stroke(0, 0, 255, 128);
  noFill();
  strokeWeight(4);
  ellipse(halfSize, halfSize, glyphSize+4);
  fill(0);
  strokeWeight(1);
}

function drawDriveMode() {
  var glyph_fn = gray_glyph;

  if(glyphSelector.value() === "color")
    glyph_fn = color_glyph;

  var glyph = glyphSelector.value();
  var glyphSize = parseInt(sizeSelector.value(), 10);
  var halfSize = glyphSize / 2;

  background(colorBack);
  var halfSize = glyphSize / 2;
  var middle_x = canvasWidth / 2;
  var middle_y = canvasHeight / 2;
  resetMatrix();
  translate(middle_x - halfSize, middle_y - halfSize);
  var val = [0,0,0];
  for(i=0; i<3; i++) {
    val[i] = val_sliders[i].value() / 10.0;
  }

  glyph_fn(val, glyphSize);
  if (show_oddball) {
    highlightGlyph(glyphSize)
  }

  resetMatrix();
  translate(middle_x + halfSize + 32, middle_y - halfSize);
  color_glyph(val, glyphSize);
}

function drawGridMode() {
  var glyph_fn = gray_glyph;
  var mode = modeSelector.value();
  if(glyphSelector.value() === "color")
    glyph_fn = color_glyph;

  var glyphSize = parseInt(sizeSelector.value(), 10);
  background(colorBack);
  if (show_oddball &&  mode == 'oddball') {
    resetMatrix();
    translate(gridOffsetX + oddball_col * gridSpacingX, gridOffsetY + oddball_row * gridSpacingY);
    highlightGlyph(glyphSize)
    // fill(colorFront);
    // noStroke();
    // rect(gridOffsetX + oddball_col * gridSpacingX, gridOffsetY + oddball_row * gridSpacingY, glyphSize, glyphSize);
  }
  for (var i=0; i<numGridRows; i++) {
    for (var j=0; j<numGridCols; j++) {
      resetMatrix();
      translate(gridOffsetX + j * gridSpacingX, gridOffsetY + i * gridSpacingY);
      for (var k=0; k<8; k++) {
        glyph_fn(gridValues[i][j], glyphSize);
      }
    }
  }
}

var analogyOffsetX = 350;
var analogyOffsetY = 40;
var analogySpacingX = 160;
var analogySpacingY = 160;
var analogyChoiceOffsetX = 260;
var analogyChoiceOffsetY = 380;
var analogyChoiceSpacingX = 100;

function drawAnalogy() {
  background(colorBack);

  var glyph_fn = gray_glyph;
  if(glyphSelector.value() === "color")
    glyph_fn = color_glyph;

  resetMatrix();
  translate(analogyOffsetX + 0 * analogySpacingX, analogyOffsetY + 0 * analogySpacingY);
  glyph_fn(analogyValues[0], 128);
  resetMatrix();
  translate(analogyOffsetX + 1 * analogySpacingX, analogyOffsetY + 0 * analogySpacingY);
  glyph_fn(analogyValues[1], 128);
  resetMatrix();
  translate(analogyOffsetX + 0 * analogySpacingX, analogyOffsetY + 1 * analogySpacingY);
  glyph_fn(analogyValues[2], 128);
  resetMatrix();
  translate(analogyOffsetX + 1 * analogySpacingX, analogyOffsetY + 1 * analogySpacingY);
  if(analogyCycleStep == 2) {
    glyph_fn(analogyValues[3], 128);
  }
  else {
    stroke(64, 64, 192);
    noFill();
    if(glyph_fn === gray_glyph) {
      ellipse(64, 64, 128+2);
    }
    else {
      rect(-1, -1, 128+2, 128+2);
    }
  }

  if(analogyCycleStep != 0) {
    for(var i=0; i<numAnalogyChoices; i++) {
      resetMatrix();
      translate(analogyChoiceOffsetX + i * analogyChoiceSpacingX, analogyChoiceOffsetY);
      if(analogyCycleStep == 2 && analogyAnswer == i) {
        stroke(64, 64, 192);
        fill(64, 64, 192);
        rect(-6, -6, 64+12, 64+12);
      }
      glyph_fn(analogyChoices[i], 64);
    }
  }
}

function draw () {
  var mode = modeSelector.value();

  if (mode == "drive") {
    drawDriveMode();
  }
  else if (mode == "analogy") {
    drawAnalogy();
  }
  else {
    drawGridMode();
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
    if(glyphSelector.value() === "color") {
      glyphSelector.value('glyph');
    }
    else {
      glyphSelector.value('color');
    }
    redraw();
  }
  else if (key == 's') {
    var old_value = guideCheckbox.checked();
    guideCheckbox.checked(!old_value);
    guideChangedEvent();
  }
  else if (key == '1') {
    sizeSelector.value('64');
    sizeChangedEvent()
  }
  else if (key == '2') {
    sizeSelector.value('128');
    sizeChangedEvent()
  }
  else if (key == '3') {
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
}
