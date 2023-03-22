const fs = require('fs')
const allPath = JSON.parse(fs.readFileSync('allPath.json', 'utf-8'));

module.exports = {
    random: function(){
        var segment1 = Object.keys(allPath).filter(e=>e != "D9").sort(() => Math.random() - 0.5).slice(0, 9);
        var segment2 = []
    
        for (var i = 0; i < segment1.length; i++){
            var dist = getZoneDist(["270", "413"], allPath[segment1[i]])
            var bestMatch = Object.keys(allPath).filter(e=>e != "D9" && !segment1.includes(e) && !segment2.includes(e)).sort((a, b) => Math.abs(dist - getZoneDist(["270", "413"], allPath[a])) - Math.abs(dist - getZoneDist(["270", "413"], allPath[b])))
            segment2.push(bestMatch[0])
        }
        
        function getZoneDist(coord1, coord2) {
            const dx = coord1[0] - coord2[0];
            const dy = coord1[1] - coord2[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
    
        return [segment1, segment2];
    }
}