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
      autoCompletePlayersName(data, "player_input", "players_list");
      break;
    case "teams":
      //Add cards with all teams
      addTeams(data);
      break;
    case "player":
      //TODO: Create Functions to load d3 visualizations

      const currentURL = new URLSearchParams(window.location.search);

      //Get Player 1
      //get player ID -> Example: Lebron James
      const playerId = currentURL.get("id");
      //get player Index on the dataset
      const playerIndexOnDataset = data.findIndex((p) => p.Player === playerId);
      const playerInfo = data[playerIndexOnDataset];

      //Get Player 2 IF DEFINED
      //get player 2 ID -> Example: Lebron James
      const player2Id = currentURL.get("id2")
        ? currentURL.get("id2")
        : undefined;
      //get player 2 Index on the dataset
      const player2IndexOnDataset = player2Id
        ? data.findIndex((p) => p.Player === player2Id)
        : undefined;
      const player2Info = player2Id ? data[player2IndexOnDataset] : undefined;

      //Get Player 3 IF DEFINED
      //get player 3 ID -> Example: Lebron James
      const player3Id = currentURL.get("id3")
        ? currentURL.get("id3")
        : undefined;
      //get player 3 Index on the dataset
      const player3IndexOnDataset = player3Id
        ? data.findIndex((p) => p.Player === player3Id)
        : undefined;
      const player3Info = player3Id ? data[player3IndexOnDataset] : undefined;

      addGeneralInfoPlayer(data, playerInfo, player2Info, player3Info);
      addRadarPlot(data, playerInfo, player2Info, player3Info);

      //add Bar Plot with the default option
      addBarPlot("insideScoring", playerInfo, player2Info, player3Info);
      const barPlotFilter = document.getElementById("barPlotFilter");
      barPlotFilter.addEventListener("change", (e) => {
        const selectedOption =
          barPlotFilter.options[barPlotFilter.selectedIndex].value;

        addBarPlot(selectedOption, playerInfo, player2Info, player3Info);
      });

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

  //add Event listener to overlay
  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach((modal) => {
      closeModal(modal);
    });
  });

  //add event listeners to buttons to close modals
  const closeModalButtons = document.querySelectorAll("[data-close-button]");
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }
}
