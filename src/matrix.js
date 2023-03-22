const Jimp = require('jimp');
const randomNumber = (x, y) => Math.random() * (y - x) + x;

module.exports = {
    create: function(ability, speed, marked_island){
        const map = [];
        for (let y = 0; y < marked_island.bitmap.height; y++) {
            const row = [];
            for (let x = 0; x < marked_island.bitmap.width; x++) {
                const pixelColor = marked_island.getPixelColor(x, y);
                const { r, g, b } = Jimp.intToRGBA(pixelColor);
                const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
                const isWalkablePixel = isWalkable(hexColor, speed);
                if (isWalkablePixel){    
                    var isRedPixel = colorDistance(`#FF9300`, `${hexColor}`)
                    if (isRedPixel < 100) {
                        row.push(0); // add a 5 with probability p
                    } else {
                        if (randomNumber(0, 200) >= ability) row.push(5); // add a 0 otherwise
                        else row.push(0);
                    }
                }else{
                    row.push(1)
                }
            }
            map.push(row);
        }

        function isWalkable(hexCode, ability) {
            var n = 100
            var diff = colorDistance(`#FF2600`, `${hexCode}`)//red
            var diff2 = colorDistance(`#874EFE`, `${hexCode}`)//purple
            if (diff < n && ability > 0.5) return false
            if (diff2 < n) return false
            
            return true
        }

        function colorDistance(hex1, hex2) {
            const rgb1 = hexToRgb(hex1);
            const rgb2 = hexToRgb(hex2);
            const rDiff = rgb1[0] - rgb2[0];
            const gDiff = rgb1[1] - rgb2[1];
            const bDiff = rgb1[2] - rgb2[2];
            return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
        }

        function hexToRgb(hex) {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            return [r, g, b];
        }
        return map
    }
}