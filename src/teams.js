module.exports = {
    form: function(group){
        var solo = [], team = [], list = []
        group.PlayerA.isSolo ? solo.push(group.PlayerA) : team.push(group.PlayerA)
        group.PlayerB.isSolo ? solo.push(group.PlayerB) : team.push(group.PlayerB)
        group.PlayerC.isSolo ? solo.push(group.PlayerC) : team.push(group.PlayerC)
        if (solo.length > 0) list.push(solo)
        if (team.length > 0) list.push(team)

        list.sort(function(x, y){
            var int1 = x.map(l=>l.Intelligence).reduce((a, b)=>a + b)/ (x.length == 1 ? 1 : x.length == 2 ? 1.75 : 2.5)
            var int2 = y.map(l=>l.Intelligence).reduce((a, b)=>a + b)/ (y.length == 1 ? 1 : y.length == 2 ? 1.75 : 2.5)
            return int2 - int1
        });
        return list
    }
}