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

      //add Plots after events
      const positionFilter = document.getElementById("parallelPosition");
      positionFilter.addEventListener("change", () => {
        addPlots("filters");
      });

      const teamSelectFilter = document.getElementById("parallelTeam");
      for (let i = 0; i < Object.keys(teams).length; i++) {
        const key = Object.keys(teams)[i];

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = key;
        input.value = key;
        input.name = key;
        input.className = "checkbox";
        input.checked = true;

        const label = document.createElement("label");
        label.setAttribute("for", key);
        label.textContent = teams[key].name;

        const div = document.createElement("div");

        div.appendChild(input);
        div.appendChild(label);

        teamSelectFilter.appendChild(div);

        input.addEventListener("click", () => {
          addPlots("filters");
        });
      }

      const minAgeInput = document.getElementById("min_age");
      const maxAgeInput = document.getElementById("max_age");

      minAgeInput.addEventListener("keyup", () => {
        addPlots("filters");
      });

      maxAgeInput.addEventListener("keyup", () => {
        addPlots("filters");
      });

      const minGamesInput = document.getElementById("min_games");
      const maxGamesInput = document.getElementById("max_games");

      minGamesInput.addEventListener("keyup", () => {
        addPlots("filters");
      });

      maxGamesInput.addEventListener("keyup", () => {
        addPlots("filters");
      });

      //helper functions
      const addPlots = (filters = "default") => {
        //If no filters passed, add the default ones
        if (filters === "default") {
          filters = {
            position: "all",
            teams: Object.keys(teams),
            age: {
              min: 0,
              max: 150,
            },
            games: {
              min: 0,
              max: 150,
            },
          };
        } else {
          const age = filterByAge();
          const games = filterByGames();
          const teams = filterTeams();
          const position = filterPosition();

          filters = {
            position,
            teams,
            age,
            games,
          };
        }

        //add default
        addParalelPlayersPlot(data, filters);
        addBoxPlotPlayers(
          data,
          filters,
          {
            "2P": { name: "2 Points Goals" },
            "3P": { name: "3 Points Goals" },
            AST: { name: "Assists per game" },
            FT: { name: "Free Throws Goals" },
            // ORB: { name: "Offensive Rebounds per game" },
          },
          "boxPlotAttack"
        );
        addBoxPlotPlayers(
          data,
          filters,
          {
            BLK: { name: "Blocks per game" },
            STL: { name: "Steals per game" },
            TRB: { name: "Rebounds per game" },
            PF: { name: "Fouls per game" },
          },
          "boxPlotDefense"
        );
      };

      const filterTeams = () => {
        const checkboxs = document.getElementsByClassName("checkbox");

        const teams = [];
        for (let i = 0; i < checkboxs.length; i++) {
          const cCheckbox = checkboxs[i];
          if (cCheckbox.checked) {
            teams.push(cCheckbox.id);
          }
        }

        return teams;
      };

      const filterPosition = () => {
        const positionFilter = document.getElementById("parallelPosition");
        const selectedOption =
          positionFilter.options[positionFilter.selectedIndex].value;

        return selectedOption;
      };

      const filterByAge = () => {
        let min = minAgeInput.value;
        let max = maxAgeInput.value;

        if (!min) min = 0;
        if (!max) max = 150;

        return { min: +min, max: +max };
      };

      const filterByGames = () => {
        let min = minGamesInput.value;
        let max = maxGamesInput.value;

        if (!min) min = 0;
        if (!max) max = 150;

        return { min: +min, max: +max };
      };

      //Default add all Plots when entering page with default filters
      addPlots();

      break;
    case "teams":
      //Add cards with all teams

      autoCompleteTeamsName(data, "team_input", "team_list");
      teamsStats(data);
      break;
    case "player":
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
      //get Team ID -> Example: LAL
      const teamId = new URLSearchParams(window.location.search).get("id");
      let players = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].Tm == teamId) players.push(data[i]);
      }
      showTeamHeader(teamId, players);
      showTeamStats(players);
      break;
    default:
      break;
  }

  //add Event listener to overlay
  const overlay = document.getElementById("overlay");

  if (overlay)
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
