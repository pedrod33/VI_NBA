function showTeamHeader(teamId, players){
    const team_main = document.getElementById("team_main");
    let teamInfo = getTeam(teamId);
    const h_div = document.createElement("div");
    h_div.style.width = "50%";
    h_div.style.display = "inline-block";
    h_div.style.height = "50%";
    const team_name = document.createElement("h1");
    team_name.textContent = teamInfo.name;

    const teamImg = document.createElement("img");
    teamImg.src = teamInfo.image;
    teamImg.alt = `Logo of team ${teamInfo.name}`;
    teamImg.id = "team_logo";
    teamImg.style.height ="175px"

    h_div.appendChild(team_name);
    h_div.appendChild(teamImg);
    team_main.appendChild(h_div);

    const line_graph_div = document.createElement("div");
    line_graph_div.style.width = "50%";
    line_graph_div.style.height = "50%";
    line_graph_div.style.display = "inline-block";
    line_graph_div.id = "team_line_graph_id"
    
    const player_tooltip = d3
    .select("#"+line_graph_div.id)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

    let team_data = individualTeamData(players);
    let statKeys = ["Age","G","MP","2P", "3P", "AST","BLK","FG","FT","STL","TOV","TRB"]
    drawLineGraph(team_data, statKeys, line_graph_div, player_tooltip);
    team_main.appendChild(line_graph_div);

}

function showTeamStats(players){
    const team_main = document.getElementById("team_main");

    let def_stats = {"BLK":{},"STL":{},"DRB":{}, "PF":{}};
    let off_stats = {"2P":{},"3P":{},"AST":{},"FT":{},"ORB":{}};
    let team_data = individualTeamData(players);   
    for(let i in Object.keys(team_data)){
        
        team_data[Object.keys(team_data)[i]].sort(function (a, b) {  return a - b;  })
    }
    const off_div = document.createElement("div");
    off_div.style.width = "50%";
    off_div.style.display = "inline-block";
    off_div.style.height = "50%";
    const def_div = document.createElement("div");
    def_div.style.width = "50%";
    def_div.style.display = "inline-block";
    def_div.style.height = "50%";

    drawBoxPlot(off_stats, team_data,off_div, "Offensive Stats")
    drawBoxPlot(def_stats, team_data,def_div, "Defensive Stats")
    team_main.appendChild(off_div);
    team_main.appendChild(def_div);


}