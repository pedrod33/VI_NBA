function addNrPlayers(data) {
  const nrPlayers = data.length;

  //add nrPlayers to card
  const playersCard = document.getElementById("players_card");
  const nrPlayersText = document.createElement("p");
  nrPlayersText.textContent = `${nrPlayers} Players`;
  playersCard.appendChild(nrPlayersText);
}

function addNrTeams(data) {
  //get all Teams going trough all players
  const teams = [];
  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i].Tm)) teams.push(data[i].Tm);
  }

  //add nrTeams to card
  const teamsCard = document.getElementById("teams_card");
  const nrTeamsText = document.createElement("p");
  nrTeamsText.textContent = `${teams.length} Teams`;
  teamsCard.appendChild(nrTeamsText);
}
