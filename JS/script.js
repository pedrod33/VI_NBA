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

      const teamSelectFilter = document.getElementById("parallelTeam");
      const allTeamsCheckbox = document.getElementById("all");

      allTeamsCheckbox.addEventListener("click", () => {
        const checkboxs = document.getElementsByClassName("checkbox");

        if (allTeamsCheckbox.checked) {
          for (let i = 0; i < checkboxs.length; i++) {
            const cCheckbox = checkboxs[i];
            cCheckbox.checked = true;
          }
        } else {
          for (let i = 0; i < checkboxs.length; i++) {
            const cCheckbox = checkboxs[i];
            cCheckbox.checked = false;
          }
        }
      });

      for (let i = 0; i < Object.keys(teams).length; i++) {
        const key = Object.keys(teams)[i];

        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = key;
        input.value = key;
        input.name = key;
        input.className = "checkbox";

        const label = document.createElement("label");
        label.setAttribute("for", key);
        label.textContent = teams[key].name;

        teamSelectFilter.appendChild(input);
        teamSelectFilter.appendChild(label);

        input.addEventListener("click", () => {
          const checkboxs = document.getElementsByClassName("checkbox");

          let allChecked = true;
          for (let i = 0; i < checkboxs.length; i++) {
            const cCheckbox = checkboxs[i];
            if (!cCheckbox.checked) {
              allChecked = false;
              break;
            }
          }

          if (allChecked) {
            document.getElementById("all").checked = true;
          } else {
            document.getElementById("all").checked = false;
          }
        });
      }

      addParalelPlayersPlot(data, {
        groupBy: "position",
        position: "",
        team: "all",
        age: { min: 0, max: Infinity },
      });
      const teamFilter = document.getElementById("parallelTeam");

      // teamFilter.addEventListener("change", (e) => {
      //   const selectedOption =
      //     teamFilter.options[teamFilter.selectedIndex].value;

      //   addParalelPlayersPlot(data, {
      //     groupBy: "position",
      //     position: "",
      //     team: selectedOption,
      //     age: { min: 0, max: Infinity },
      //   });
      // });

      break;
    case "teams":
      //Add cards with all teams
      addTeams(data);
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
      //TODO: On teamsData, create functions to do the calculations for teams statistics
      //TODO: Create Functions to load d3 visualizations

      //get Team ID -> Example: LAL
      const teamId = new URLSearchParams(window.location.search).get("id");
      console.log("team", teamId);

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
