function showTeamHeader(teamId, players) {
  const team_main = document.getElementById("team_main");
  let teamInfo = getTeam(teamId);

  const teamInfoDiv = document.getElementById("teamInfoDiv");
  const team_name = document.createElement("h1");
  team_name.textContent = teamInfo.name;
  teamInfoDiv.appendChild(team_name);
  const teamImg = document.createElement("img");
  teamImg.src = teamInfo.image;
  teamImg.alt = `Logo of team ${teamInfo.name}`;
  teamImg.id = "team_logo";
  teamInfoDiv.appendChild(teamImg);

  const line_graph_div = document.getElementById("team_line_graph_id");

  const player_tooltip = d3
    .select("#team_line_graph_id")
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
  let statKeys = [
    "Age",
    "G",
    "MP",
    "2P",
    "3P",
    "AST",
    "BLK",
    "FG",
    "FT",
    "STL",
    "TOV",
    "TRB",
  ];
  drawLineGraph(
    team_data,
    statKeys,
    line_graph_div,
    player_tooltip,
    "Individual Stats"
  );
}

function showTeamStats(players) {
  let def_stats = { BLK: {}, STL: {}, TRB: {}, PF: {} };
  let off_stats = { "2P": {}, "3P": {}, AST: {}, FT: {} };
  let team_data = individualTeamData(players);
  for (let i in Object.keys(team_data)) {
    team_data[Object.keys(team_data)[i]].sort(function (a, b) {
      return a - b;
    });
  }

  const off_div = document.getElementById("boxPlotAttackTeam");
  const def_div = document.getElementById("boxPlotDefenseTeam");

  drawBoxPlot(off_stats, team_data, off_div, "Offensive Stats");
  drawBoxPlot(def_stats, team_data, def_div, "Defensive Stats");
}
