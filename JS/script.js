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
      const player1Info = data[playerIndexOnDataset];

      //FIXME: Remove: ONLY HERE FOR TESTING REASONS
      const player2Info = data[1];

      addGeneralInfoPlayer(player1Info);
      addRadarPlot(data, player1Info, player2Info);
      break;
    case "team":
      //TODO: On teamsData, create functions to do the calculations for teams statistics
      //TODO: Create Functions to load d3 visualizations

      //get Team ID -> Example: LAL
      const teamId = new URLSearchParams(window.location.search).get("id");
      console.log("team", teamId);

      break;
    default:
      break;
  }
}
