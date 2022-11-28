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