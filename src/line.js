const Jimp = require('jimp');

module.exports = {
    draw: function(pathColor, x, y, image){
        const halfWidth = 1;
        const shadowOffset = 1; // adjust the shadow offset as needed
        
        // draw the path
        for (let i = -halfWidth; i <= halfWidth; i++) {
          for (let j = -halfWidth; j <= halfWidth; j++) {
            image.setPixelColor(Jimp.cssColorToHex(pathColor), x + i, y + j);
          }
        }
        
        // darken the surrounding pixels for a shadow effect
        for (let i = -halfWidth - shadowOffset; i <= halfWidth + shadowOffset; i++) {
          for (let j = -halfWidth - shadowOffset; j <= halfWidth + shadowOffset; j++) {
            const pixelColor = image.getPixelColor(x + i, y + j);
            const { r, g, b } = Jimp.intToRGBA(pixelColor);
            const newColor = Jimp.rgbaToInt(r, g, b, 255);
            image.setPixelColor(newColor, x + i, y + j);
          }
        }
    }
}