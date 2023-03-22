var easystarjs = require('easystarjs');
var easystar = new easystarjs.js();
const line = require('./line.js');

module.exports = {
    drawIsland: async function(xStart, yStart, xCoord, yCoord, empty, color, ability, map, elapsed){
        //astarfinder
        var ovrAbility = 0.3 + ((100 - ability)/100) //convert ability to time
        easystar.setGrid(map);
        easystar.setAcceptableTiles([0, 5]);
        easystar.enableDiagonals();
        easystar.setTileCost(5, ((ovrAbility - 0.3) * 100))

        function findPath() {
            return new Promise((resolve, reject) => {
                easystar.findPath(xStart, yStart, xCoord, yCoord, function( route ) {
                    var path = route.map(e=>[e.x, e.y])

                    var arrived = true
                    var lastPosX = xStart, lastPosY = yStart

                    for (let i = 0; i < path.length; i++) {
                        if (elapsed >= 60) {arrived = false;continue}
                        var nx = path[i][0]
                        var ny = path[i][1]
                        line.draw(color, nx, ny, empty)
                        elapsed += ovrAbility //how much time gets elapsed per pixel movement
                        lastPosX = nx
                        lastPosY = ny
                    }

                    const result = [lastPosX, lastPosY, elapsed, arrived]
                    resolve(result);

                });
                
                easystar.calculate();
            })
        }
        return await findPath();
    }
}
