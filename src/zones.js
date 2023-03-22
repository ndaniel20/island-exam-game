const fs = require('fs')
const allPath = JSON.parse(fs.readFileSync('allPath.json', 'utf-8'));

module.exports = {
    sort: function(zones, c){
        var list = ["D9"]
    
        while (list.length != zones.length + 1){
            var current = allPath[list[list.length - 1]]
            var temporary = ""
            var smallest = 1000
            for (var i = 0; i < zones.length; i++){
                if (list.includes(zones[i])) continue
                var dist = getZoneDist(allPath[zones[i]], current)
                var filteredZone = zones.filter(e=>!list.includes(e))
                var avgX = filteredZone.map(e=>parseInt(allPath[e][0])).reduce((a, b) => a + b)/filteredZone.length
                var avgY = filteredZone.map(e=>parseInt(allPath[e][1])).reduce((a, b) => a + b)/filteredZone.length
                var n = getZonesBetween(zones[i], list[list.length - 1]).filter(e=>!allPath[e])
                var offAverage = getZoneDist(allPath[zones[i]], [avgX, avgY]) * (0.75 - (c * 0.50))
                dist += n.length * 50
                dist = ((500 - offAverage) + dist)/2
    
                if (smallest > dist){
                    smallest = dist
                    temporary = zones[i]
                }
            }
            list.push(temporary)
        }

        function getZoneDist(coord1, coord2) {
            const dx = coord1[0] - coord2[0];
            const dy = coord1[1] - coord2[1];
            return Math.sqrt(dx * dx + dy * dy);
        }

        function getZonesBetween(startZone, endZone) {
            var currentZone = startZone
            var zones = []
            while (currentZone != endZone){
                var letter1 = currentZone[0].charCodeAt(0);var letter2 = endZone[0].charCodeAt(0);
                var num1 = parseInt(currentZone.slice(1));var num2 = parseInt(endZone.slice(1))
                if (Math.abs(num1 - num2) < Math.abs(letter1 - letter2)){
                    if (letter1 != letter2 && letter1 > letter2) currentZone = String.fromCharCode(letter1 - 1) + currentZone.slice(1)
                    if (letter1 != letter2 && letter1 < letter2) currentZone = String.fromCharCode(letter1 + 1) + currentZone.slice(1)
                }else{
                    if (num1 != num2 && num1 > num2) currentZone = currentZone[0] + (num1 - 1)
                    if (num1 != num2 && num1 < num2) currentZone = currentZone[0] + (num1 + 1)
                }
                zones.push(currentZone)
            }
            return zones
        }
        
        return list
    }
}