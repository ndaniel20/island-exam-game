const Jimp = require('jimp');
const fs = require('fs')
const playersList = JSON.parse(fs.readFileSync('candidates.json', 'utf-8'));
const allPath = JSON.parse(fs.readFileSync('allPath.json', 'utf-8'));

const selection = require('./src/selection.js');
const events = require('./src/events.js');
const teams = require('./src/teams.js');
const matrix = require('./src/matrix.js');
const zones = require('./src/zones.js');
const player = require('./src/player.js');

(async() => {
    const island = await Jimp.read('img/island.png');
    const marked_island = await Jimp.read('img/island-with-path.png');

    var randomSel = selection.random() //randomly select 10 zones for both groups
    var segments1 = randomSel[0] 
    var segments2 = randomSel[1] 
    var events1 = events.create(segments1) //create skill events for the candidates of group A
    var events2 = events.create(segments2) //create skill events for the candidates of group B

    var colors1 = ["#1e90ff", "#87ceeb", "#1c39bb"] //colors for Group A
    var colors2 = ["#ed2939", "#f08080", "#a9203e"] //colors for Group B
    var positionTrack1 = []
    var positionTrack2 = []
    var leaderboardA = {[playersList.GroupA.PlayerA.Name]: [], [playersList.GroupA.PlayerB.Name]: [], [playersList.GroupA.PlayerC.Name]: []}
    var leaderboardB = {[playersList.GroupB.PlayerA.Name]: [], [playersList.GroupB.PlayerB.Name]: [], [playersList.GroupB.PlayerC.Name]: []}
    var time = 7 //adjust time (hours)

    const promisesA = teams.form(playersList.GroupA).map(async (e, n)=>{
        var max = e.length == 1 ? 1 : e.length == 2 ? 2.25 : 3.5
        var intlg = e.map(l=>l.Intelligence).reduce((a, b)=>a + b)/max //add the group's intelligence score
        var ablty = e.map(l=>l.Speed).reduce((a, b)=>a + b)/max //add the group's speed score
        var mat = matrix.create(intlg, ablty, marked_island) //create the matrix of the map based on the walkable path of the island, and the players physique and intelligence to find a suitable path
        var seg = zones.sort(segments1, n) //sort the order of the zones in the order thats most efficient
        await Promise.all(e.map(async p =>{
            var player = await Jimp.read(p.Face)
            player.resize(30, 30);
            player.circle();
            var border = addRedBorder(player, colors1[n])
            positionTrack1.push({name: p.Name, academic: p.Academic, physical: p.Physical, color: colors1[n], icon: border, x: allPath[seg[0]][0], y: allPath[seg[0]][1], tracks: [...seg], team: n, matrix: mat, ability: ablty})
        }))
    })

    const promisesB = teams.form(playersList.GroupB).map(async (e, n)=>{
        var max = e.length == 1 ? 1 : e.length == 2 ? 2.25 : 3.5
        var intlg = e.map(l=>l.Intelligence).reduce((a, b)=>a + b)/max //add the group's intelligence score
        var ablty = e.map(l=>l.Speed).reduce((a, b)=>a + b)/max //add the group's speed score
        var mat = matrix.create(intlg, ablty, marked_island) //create the matrix of the map based on the walkable path of the island, and the players physique and intelligence to find a suitable path
        var seg = zones.sort(segments2, n) //sort the order of the zones in the order thats most efficient
        await Promise.all(e.map(async p =>{
            var player = await Jimp.read(p.Face)
            player.resize(30, 30);
            player.circle();
            var border = addRedBorder(player, colors2[n])
            positionTrack2.push({name: p.Name, academic: p.Academic, physical: p.Physical, color: colors2[n], icon: border, x: allPath[seg[0]][0], y: allPath[seg[0]][1], tracks: [...seg], team: n, matrix: mat, ability: ablty})
        }))
    })

    await Promise.all([...promisesA, ...promisesB])

    for (var i = 0; i < 10; i++){
        var faces = new Jimp(island.bitmap.width, island.bitmap.height, 0x00000000);
        var pixelRoutes = new Jimp(island.bitmap.width, island.bitmap.height, 0x00000000);
        await Promise.all(
            positionTrack1.map(async p=>await player.add(leaderboardA, p.icon, faces, pixelRoutes, positionTrack1, p, p.color, events1)),
        )
        await Promise.all(
            positionTrack2.map(async p=>await player.add(leaderboardB, p.icon, faces, pixelRoutes, positionTrack2, p, p.color, events2))
        )

        var arr1 = positionTrack1.map(e=>e.tracks.filter(n=>n != "D9").map(f=>allPath[f]))
        var arr2 = positionTrack2.map(e=>e.tracks.filter(n=>n != "D9").map(f=>allPath[f]))
        arr1.forEach(a=>a.slice(1).forEach(c=>addEndPoint(c[0], c[1], pixelRoutes, "#0899ff", 5.5, "#000000")))
        arr2.forEach(a=>a.slice(1).forEach(c=>addEndPoint(c[0], c[1], pixelRoutes, "#f80808", 5.5, "#000000")))
        
        island.brightness(-0.025).contrast(0.025)
        var clone = island.clone();
        clone.composite(pixelRoutes, 0, 0)
        clone.composite(faces, 0, 0);
        clone.dither565();
        clone.crop(30, 0, clone.bitmap.width - 65, clone.bitmap.height);
        time += 1 
        clone.write("img/output.png")
        var mutual1 = getMutualZones(leaderboardA)
        var mutual2 = getMutualZones(leaderboardB)
        var score1 = calculateScore(mutual1.zone.length, mutual1.visited, mutual1.sum)
        var score2 = calculateScore(mutual2.zone.length, mutual2.visited, mutual2.sum)
        console.log(`Group A ` + score1 + " - " + score2 + " Group B")
        //await delay(2500) 
    } 
    function calculateScore(n1, n2, n3){
        return Math.round(((0.5 * (n1/9)) + (0.2 * (n2/27)) + (0.3 * Math.min((n3/50), 1))) * 100)
    }
    
    function getMutualZones(students){
        const zoneCounts = {};
        var num = 0
        var count = 0
        Object.values(students).forEach(studentVisits => {
        studentVisits.forEach(visit => {
            const zone = Object.keys(visit)[0];
            num += visit[zone];
            count++
            zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
        });
        });
    
        const allVisitedZones = Object.keys(zoneCounts).filter(zone => zoneCounts[zone] === Object.keys(students).length);
        return {zone: allVisitedZones.slice(0, 9), visited: count,sum: num}
    }

    function addRedBorder(image, color){
        const borderWidth = 10;
        const borderColor = color; // red color
        const borderSize = image.bitmap.width + borderWidth * 2;
        const border = new Jimp(borderSize, borderSize, borderColor);
        border.circle({ radius: image.bitmap.width / 1.6 });
        border.composite(image, borderWidth, borderWidth);
        return border
    }

    function addEndPoint(centerX, centerY, image, color, radius, border){
        for (let x = 0; x < image.bitmap.width; x++) {
          for (let y = 0; y < image.bitmap.height; y++) {
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
            if (distance < radius) {
                if (distance > radius - 1.5) {
                    image.setPixelColor(Jimp.cssColorToHex(border), x, y)
                }else{
                    image.setPixelColor(Jimp.cssColorToHex(color), x, y);
                }
            }
          }
        }
    }


})()