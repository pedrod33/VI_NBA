function showTeamHeader(teamId, players){
    const team_main = document.getElementById("team_main");
    let teamInfo = getTeam(teamId);
    const h_div = document.createElement("div");
    h_div.style.width = "25%";
    const team_name = document.createElement("h1");
    team_name.textContent = teamInfo.name;

    const teamImg = document.createElement("img");
    teamImg.src = teamInfo.image;
    teamImg.alt = `Logo of team ${teamInfo.name}`;
    teamImg.id = "team_logo";
    teamImg.style.height ="175px"
    h_div.style.display = "inline-block";
    h_div.style.height = "50%";

    h_div.appendChild(team_name);
    h_div.appendChild(teamImg);
    team_main.appendChild(h_div);

    const line_graph_div = document.createElement("div");
    line_graph_div.style.width = "70%";
    line_graph_div.style.height = "50%";

    line_graph_div.style.display = "inline-block";
    line_graph_div.id = "team_line_graph_id"
    drawLineGraph(players, line_graph_div.id);
    team_main.appendChild(line_graph_div, line_graph_div.id);

    const violin_graph_div = document.createElement("div");
    violin_graph_div.id = "team_violin_graph"
    violin_graph_div.style.width = "70%";
    violin_graph_div.style.height = "50%";
    drawViolinPlot(players,[1,23], violin_graph_div);
    team_main.appendChild(violin_graph_div, violin_graph_div.id);

}