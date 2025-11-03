function SpotGlyph() {
  this.spot_hue = 100;
  this.spot_range = 60;

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
   *
   * this glyph can utilize changes in brightness and saturation, but only
   * using the spot_hue set above. So:
   *
   *    + hue will always be set to spot_hue (a value from 0-360)
   *    + saturation can vary from 0-100
   *    + brighness can vary from 0-100
   *
   * examples:
   *    - fill(this.spot_hue, 25, 50);     // desaturated. middle brightness.
   *    - stroke(this.spot_hue, 100, 100); // fully saturated and maximum brightness
   */
  this.draw = function(values, size) {
	//variables for the min and max values of our range
	var spotMin = this.spot_hue - this.spot_range / 2;
    var spotMax = this.spot_hue  + this.spot_range / 2;
	
	//build an array of all the hue values from the curEmojiPixels array
	var hues = Array();
	for(var i = 0; i < 18; i++){
		for(var j = 0; j < 18; j++){
			hues.push(floor(curEmojiPixels[i][j][0]));
		}
	}
	
	//create a new GrayGlyph
	var glyph = new GrayGlyph();
	
	//find out how many values in the hues array are within the desired range
	var frequency = rangeFrequency(hues, spotMin, spotMax);
	
	if(frequency < 12){
		//if hueFrequency is not high enough find out what the most common value is in the hues array
		var mostCommon = mostCommonHue(hues);
		//use this value to create new values for the desired range
		spotMin = mostCommon - this.spot_range / 2;
		spotMax = mostCommon + this.spot_range / 2;
	}
	
	//if spotMin is less than 0 add 360 so it stays within the range of acceptable values for the hue dimension
	if(spotMin < 0){
		spotMin = spotMin + 360;
	}
	//if spotMax is greater than 359 subtract 360 so it stays within the range of acceptable values for the hue dimension
	if(spotMax > 359){
		spotMax = spotMax - 360;
	}
	//draw the glpyh, using some colour if it is with the desired range
    glyph.draw(values, size, this.spot_hue, spotMin, spotMax);
  }
}

/*
 * function to determine how many values are within the desired range
 * any value >= spotMin or <= spotMax meets the requirements
 * @param  {Array}  hues       	- Array of values to compare against
 * @param  {Number} spotMin    	- lowest value of the desired range
 * @param  {Number} spotMax    	- highest value of the desired range
 * @return {Number} count   	- the number of elements in the hues array that are within the desired range
 */
function rangeFrequency(hues, spotMin, spotMax){
	var count = 0;
    for (var i = 0; i < hues.length; i++) {
        if (hues[i] >= spotMin && hues[i] <= spotMax) {
            count++;
        }
    }
    return count;
}

/*
 * function to determine which hue occurs most frequently in an array
 * adapted from: http://stackoverflow.com/questions/3783950/get-the-item-that-appears-the-most-times-in-an-array
 * @param  {Array}  hues       	- Array of hue values 
 * @return {Number} result   	- The value that appears most frequently in the hues array
 */
function mostCommonHue(hues){
	var frequency = {};  // array of frequency.
	var max = 0;  // holds the max frequency.
	var result;   // holds the max frequency element.
	for(var v in hues) {
		frequency[hues[v]]=(frequency[hues[v]] || 0)+1; // increment frequency.
		if(frequency[hues[v]] > max) { // is this frequency > max so far ?
				max = frequency[hues[v]];  // update max.
				result = hues[v];          // update result.
		}
	}
	return result;
}