## PS2 MDDN 242 2017

### Color Glyphs - Spot Colour

For this part I wanted to use the colour splash effect with the same glyph from the previous part of the project.  I did this by using a range to determine whether or not the spot hue should be used in the glyph. The downside to this approach is that not every emoji has colours within the range. 

To overcome this I implemented some code that determines if their will be enough values in the curEmojiPixels array for a colour splash. If not I then determine which hue appears most and use that hue to set the values of my range. 

This has worked very well and now most images have an interesting colour splash effect.