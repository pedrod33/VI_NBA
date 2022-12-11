function autoCompleteTeamsName(players, inputRef, listRef, compareId = -1) {
  const teams = [];
  for (let i = 0; i < players.length; i++) {
    if (!teams.includes(players[i].Tm)) teams.push(players[i].Tm);
  }

  //reference
  let teamInput = document.getElementById(inputRef);
  const team_list = document.getElementById(listRef);

  //Execute function on keyup
  teamInput.addEventListener("keyup", () => {
    //loop through above array
    //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
    removeElements();
    const filter = teamInput.value;
    for (let team of teams) {
      const teamInfo = getTeam(team);
      //convert input to lowercase and compare with each string
      if (
        teamInfo.name.toLowerCase().startsWith(filter.toLowerCase()) &&
        filter !== ""
      ) {
        //create li element
        const listItem = document.createElement("li");
        listItem.classList.add("tlist-item");

        //Create img element of team
        const teamImg = document.createElement("img");
        teamImg.src = teamInfo.image;
        teamImg.alt = "Logo of team ${teamInfo.name}";

        //Display matched part in bold
        const match = document.createElement("b");
        match.textContent = teamInfo.name.substr(0, filter.length);

        //Display unmatched part in regular
        const rest = document.createElement("span");
        rest.textContent = teamInfo.name.substr(filter.length);

        const teamName = document.createElement("p");
        teamName.appendChild(match);
        teamName.appendChild(rest);

        //Create link element that contains player name
        const teamLink = document.createElement("a");
        teamLink.href = `./team.html?id=${team}`;
        teamLink.appendChild(teamImg);
        teamLink.appendChild(teamName);

        //add link to listItem and add it to the global List
        listItem.appendChild(teamLink);
        team_list.appendChild(listItem);
      }
    }
  });

  function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".tlist-item");
    items.forEach((item) => {
      item.remove();
    });
  }
}

function teamsStats(data) {
  let statKeys = [
    "Age",
    "G",
    "MP",
    "PTS",
    "2P",
    "3P",
    "AST",
    "BLK",
    "FG",
    "FT",
    "STL",
    "TOV",
    "TRB",
    "DRB",
    "ORB",
    "PF",
  ];
  let x_axis = [
    "Age",
    "G",
    "MP",
    "PTS",
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

  let [team_total_data, avg_per_player_data] = teamData(data);

  const line_graph_div = document.getElementById("team_line_graph_id");

  const tooltip = d3
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

  const select = document.getElementById("filter_selection");
  const from_field = document.getElementById("from_field");
  const to_field = document.getElementById("to_field");
  select.addEventListener("change", function () {
    if (from_field.value != "" || to_field.value != "")
      updateGraphs(
        avg_per_player_data,
        statKeys,
        line_graph_div,
        tooltip,
        from_field.value,
        to_field.value,
        select.value
      );
  });

  from_field.addEventListener("keyup", function () {
    console.log("entrei no from field");

    updateGraphs(
      avg_per_player_data,
      statKeys,
      line_graph_div,
      tooltip,
      from_field.value,
      to_field.value,
      select.value
    );
  });

  to_field.addEventListener("keyup", function () {
    console.log("entrei no to field");

    updateGraphs(
      avg_per_player_data,
      statKeys,
      line_graph_div,
      tooltip,
      from_field.value,
      to_field.value,
      select.value
    );
  });

  drawLineGraphTeams(
    avg_per_player_data,
    x_axis,
    line_graph_div,
    tooltip,
    "Team Stats"
  );

  const off_div = document.getElementById("off_div");
  const def_div = document.getElementById("def_div");

  drawBoxPlotTeams(["2P", "3P", "AST", "FT"], avg_per_player_data, off_div, [
    "2 Point Goals",
    "3 Point Goals",
    "Assists per game",
    "Free Throw Goals",
  ]);
  drawBoxPlotTeams(["BLK", "STL", "TRB", "PF"], avg_per_player_data, def_div, [
    "Blocks per game",
    "Steals per game",
    "Rebounds per game",
    "Fouls per Game",
  ]);
}

function updateGraphs(data, x_axis, id, tooltip, from_field, to_field, select) {
  console.log("entrei no updateGraphs");

  const dimensions = {
    // Rk: "Rank",
    Age: "Age",
    "3P%": "Avg. 3P%",
    "3P": "3 Point Goals",
    "2P%": "Avg. 2P%",
    "2P": "2 Point Goals",
    "FT%": "Avg. FT%",
    FT: "Free Throw Goals",
    TRB: "Avg. Rebounds",
    AST: "Avg. Assists",
    STL: "Avg. Steals",
    BLK: "Avg. Blocks",
    TOV: "Avg. Turnovers",
    PF: "Avg. Fouls",
    PTS: "Avg. Points",
  };

  if (!to_field) to_field = Infinity;
  if (!from_field) from_field = 0;
  if (to_field <= from_field) {
    return;
  }

  let cloneData = {
    Tm: data["Tm"],
  };

  for (let i = 0; i < data[select].length; i++) {
    if (data[select][i] >= from_field && data[select][i] <= to_field) {
      for (let k = 0; k < Object.keys(dimensions).length; k++) {
        if (typeof cloneData[Object.keys(dimensions)[k]] == "undefined") {
          cloneData[Object.keys(dimensions)[k]] = [
            data[Object.keys(dimensions)[k]][i],
          ];
        } else {
          cloneData[Object.keys(dimensions)[k]].push(
            data[Object.keys(dimensions)[k]][i]
          );
        }
      }
    }
  }

  console.log("cloneData", cloneData);

  if (Object.keys(cloneData).length > 0) {
    d3.selectAll(".team_wrap").remove();
    d3.selectAll(".box_plot_svg").remove();

    drawLineGraphTeams(cloneData, x_axis, id, tooltip);
    const off_div = document.getElementById("off_div");
    const def_div = document.getElementById("def_div");

    drawBoxPlotTeams(["2P", "3P", "AST", "FT%"], cloneData, off_div, [
      "2 Point Goals",
      "3 Point Goals",
      "Assists per game",
      "Free Throw Goals",
    ]);
    drawBoxPlotTeams(["BLK", "STL", "TRB", "PF"], cloneData, def_div, [
      "Blocks per game",
      "Steals per game",
      "Rebounds per game",
      "Fouls per Game",
    ]);
  }
}
