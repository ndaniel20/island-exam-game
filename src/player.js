const fs = require('fs')
const randomNumber = (x, y) => Math.random() * (y - x) + x;
const allPath = JSON.parse(fs.readFileSync('allPath.json', 'utf-8'));
const eventsList = JSON.parse(fs.readFileSync('eventsList.json', 'utf-8'));
const pathWay = require('./pathfinding.js');

module.exports = {
    add: async function(leaderboard, border, faces, pixelRoutes, positionTrack, Track, color, events){
        var elapsed = 0
        var playerSegment = Track.tracks
        while (elapsed < 60 && playerSegment[0] && playerSegment[1]){
            var coord = playerSegment.map(s=>allPath[s])
            var [x, y, elapsed, finished] = await pathWay.drawIsland(parseInt(Track.x), parseInt(Track.y), parseInt(coord[1][0]), parseInt(coord[1][1]), pixelRoutes, color, Track.ability, Track.matrix, elapsed)
            Track.x = x
            Track.y = y
            if (finished) {
                var score = 0, count = 0
                var event = events[playerSegment[1]]
                var talent = eventsList.Academic.includes(event) ? Track.academic : Track.physical
                while (count < 40) {
                    if (talent > randomNumber(0, 100)) score += 0.1
                    else score -= 0.25
                    count += 1
                }
                var total = Math.max(Math.min(Math.ceil(Math.max(score, 0)), 4), 0.5)
                if (total == 3) randomNumber(0, 100) >= 50 ? total = 4 : total = 2 
                leaderboard[Track.name].push({[playerSegment[1]]: total})
                playerSegment.shift()
            }
        }
  
        var teams = positionTrack.filter(t=>t.team == Track.team)
        var i = teams.indexOf(Track)
        var index = -((teams.length - 1)/2) + i
        faces.composite(border, (index * border.bitmap.width / 2) + (Track.x - border.bitmap.width / 2), (Track.y - border.bitmap.height / 2));
    }
}