function addGeneralInfoPlayer(
  player1 = undefined,
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
