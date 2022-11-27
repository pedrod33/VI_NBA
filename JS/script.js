//function that is called on the load of the body, and receives the current page
async function main(page) {
  //Menu appears in all pages, so we render it, and pass the current page, so it know which tab is active
  renderMenu(page);

  //load datest
  const data = await d3.dsv(
    ";",
    ".././data/2022-2023_NBA_Player_Stats.csv",
    (d) => {
      return d;
    }
  );

  //switch with all pages
  switch (page) {
    case "home":
      //Add nr players and nr teams to cards on homepage
      addNrPlayers(data);
      addNrTeams(data);
      break;
    case "players":
      //Add form that contains an auto complete input
      autoCompletePlayersName(data);
      break;
    case "teams":
      //Add cards with all teams
      addTeams(data);
      break;
    case "player":
      //TODO: Create Functions to load d3 visualizations

      //FIXME: Might change when adding multiple player comparations
      //get player ID -> Example: Lebron James
      const playerId = new URLSearchParams(window.location.search).get("id");
      //get player Index on the dataset
      const playerIndexOnDataset = data.findIndex((p) => p.Player === playerId);
      const playerInfo = data[playerIndexOnDataset];

      //FIXME: Remove: ONLY HERE FOR TESTING REASONS
      const player2Info = data[1];
      const player2Stats = getPlayerStats(player2Info, data);

      //get playerStats
      const player1Stats = getPlayerStats(playerInfo, data);

      addGeneralInfoPlayer(playerInfo);
      addRadarPlot(player1Stats, player2Stats);
      break;
    case "team":
      //TODO: On teamsData, create functions to do the calculations for teams statistics
      //TODO: Create Functions to load d3 visualizations

      //get Team ID -> Example: LAL
      const teamId = new URLSearchParams(window.location.search).get("id");
      let players = [];
      for (let i = 0; i < data.length; i++) {
        if(data[i].Tm == teamId) players.push(data[i]);
      }
      showTeamHeader(teamId, players)
      showTeamStats(players)
      //addEventListener(teamId, data)
      break;
    default:
      break;
  }
}
