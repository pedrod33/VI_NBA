function addGeneralInfoPlayer(
  player1,
  player2 = undefined,
  player3 = undefined
) {
  const main = document.getElementById("player_main");
  const listPlayerAttributes = document.getElementById("player_attributes");

  const header = document.createElement("h1");
  header.textContent = `Player: ${player1.Player}`;

  //Create elements with general info
  const playerTeam = document.createElement("a");
  playerTeam.textContent = getTeam(player1.Tm).name;
  const playerAge = document.createElement("span");
  playerAge.textContent = player1.Age;
  const playerPosition = document.createElement("span");
  playerPosition.textContent = player1.Pos;

  //get List elements
  const playerTeamEl = document.getElementById("player_team");
  const playerPositionEl = document.getElementById("player_position");
  const playerAgeEl = document.getElementById("player_age");

  //add href to link
  playerTeam.href = `./team.html?id=${player1.Tm}`;

  //add general info to list elements
  playerTeamEl.appendChild(playerTeam);
  playerPositionEl.appendChild(playerPosition);
  playerAgeEl.appendChild(playerAge);

  main.insertBefore(header, listPlayerAttributes);
}

function addRadarPlot(player1, player2 = undefined, player3 = undefined) {
  // create a tooltip
  const player_tooltip = d3
    .select("#starPlotContainer")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  const container = document.getElementById("radarPlotContainer");

  const w = container.offsetWidth - 40 - 40;
  const h = 400 - 40 - 40;
  const margin = 40;
  const color = d3.scaleOrdinal().range(["#CC333F", "#00A0B0"]);

  const starCfg = {
    w, //Width of the circle
    h, //Height of the circle
    margin, //The margins of the SVG
    levels: 2, //How many levels or inner circles should there be drawn
    maxValue: 100, //What is the value that the biggest circle will represent
    labelFactor: 1.2, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 130, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
    color, //Color function
  };

  const axisVariables = Object.keys(player1).map((a) => a);

  //array that contains the player arrays of information
  const data = [];

  //array that contains player 1 information
  const player1Data = [];
  for (let i = 0; i < axisVariables.length; i++) {
    player1Data.push({
      axis: axisVariables[i],
      value: player1[axisVariables[i]],
    });
  }
  data.push(player1Data);

  if (player2) {
    //array that contains player 1 information
    const player2Data = [];
    for (let i = 0; i < axisVariables.length; i++) {
      player2Data.push({
        axis: axisVariables[i],
        value: player2[axisVariables[i]],
      });
    }
    data.push(player2Data);
  }

  drawRadarPlot(
    "#radarPlotContainer",
    starCfg,
    axisVariables,
    data,
    player_tooltip
  );
}
