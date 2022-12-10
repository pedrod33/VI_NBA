function individualTeamData(teamData){
    let playerStats = {}
    let teamKeys = Object.keys(teamData[0]);
    for(let i = 0; i<teamData.length; i++){
        for(let j = 0; j<teamKeys.length;j++){
            if(!isNaN(teamData[i][teamKeys[j]])){
                if(!playerStats[teamKeys[j]]){
                    playerStats[teamKeys[j]]=[parseFloat(teamData[i][teamKeys[j]])]
                }
                else{
                    playerStats[teamKeys[j]].push(parseFloat(teamData[i][teamKeys[j]]))
                }
            }
            else{
                if(!playerStats[teamKeys[j]]){
                    playerStats[teamKeys[j]]=[teamData[i][teamKeys[j]]]
                }
                else{
                    playerStats[teamKeys[j]].push(teamData[i][teamKeys[j]])
                }

            }
        }
    }
    return playerStats;
}

function teamData(data){
    let teamStats = {}
    let attrs = Object.keys(data[0]);
    attrs = attrs.filter(function(a){
        return a!="Player" && a!="Rk" && a != "Pos" && a != "Tm";
    });
    for (let i = 0; i < data.length; i++) {
        let pTeam = data[i].Tm
        if(!Object.keys(teamStats).includes(pTeam)){
            teamStats[pTeam] = {};

            for(let x = 0; x<attrs.length;x++){
                teamStats[pTeam][attrs[x]] = parseFloat(data[i][attrs[x]])
            }
            teamStats[pTeam]["NPlayers"] = 1;
        }
        else{
            for(let x = 0; x<attrs.length;x++){
                teamStats[pTeam][attrs[x]] += parseFloat(data[i][attrs[x]])
            }
            teamStats[pTeam]["NPlayers"]+=1
        }
    }
    let teams = Object.keys(teamStats);
    let totalStats = {};
    let ppStats = {};
    attrs = Object.keys(teamStats[teams[0]]);
        for(let j = 0; j<attrs.length;j++){
            totalStats[attrs[j]] = []
            ppStats[attrs[j]] = []

        }
        totalStats["Tm"] = [];
        ppStats["Tm"] = []
    
    for (let i = 0; i < teams.length; i++) {
        for(let j = 0; j<attrs.length;j++){
            if(attrs[j]!="NPlayers"){
                totalStats[attrs[j]].push(teamStats[teams[i]][attrs[j]]);
                ppStats[attrs[j]].push(teamStats[teams[i]][attrs[j]]/teamStats[teams[i]]["NPlayers"]);
            }
            else{
                totalStats[attrs[j]].push(teamStats[teams[i]][attrs[j]]);
                ppStats[attrs[j]].push(teamStats[teams[i]][attrs[j]]);

            }

        }
        totalStats["Tm"].push(teams[i])
        ppStats["Tm"].push(teams[i])

    }
    return [totalStats, ppStats];
}