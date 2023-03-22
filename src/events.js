const randomNumber = (x, y) => Math.random() * (y - x) + x;
const fs = require('fs')
const eventsList = JSON.parse(fs.readFileSync('eventsList.json', 'utf-8'));

module.exports = {
    create: function(arr){
        var list = {}; 
        var saved = []
        for (var i = 0; i < arr.length; i++){
            var randomEvent1 = eventsList.Academic.filter(e=>!saved.includes(e))[Math.floor(Math.random()*eventsList.Academic.filter(e=>!saved.includes(e)).length)]
            var randomEvent2 = eventsList.Physical.filter(e=>!saved.includes(e))[Math.floor(Math.random()*eventsList.Physical.filter(e=>!saved.includes(e)).length)]
            if (randomNumber(0, 100) >= 50) {
                list[arr[i]] = randomEvent1
                saved.push(randomEvent1)
            }
            else{
                list[arr[i]] = randomEvent2
                saved.push(randomEvent2)
            }
        }
        return list
    }
}