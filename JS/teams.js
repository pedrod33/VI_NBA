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
        "Team Stats",
        from_field.value,
        to_field.value,
        select.value
      );
  });

  from_field.addEventListener("keyup", function () {
    console.log("entrei no from");

    updateGraphs(
      avg_per_player_data,
      statKeys,
      line_graph_div,
      tooltip,
      "Team Stats",
      from_field.value,
      to_field.value,
      select.value
    );
  });

  to_field.addEventListener("keyup", function () {
    updateGraphs(
      avg_per_player_data,
      statKeys,
      line_graph_div,
      tooltip,
      "Team Stats",
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

  drawBoxPlotTeams(
    ["2P", "3P", "AST", "FT"],
    avg_per_player_data,
    off_div,
    "Offensive Stats"
  );
  drawBoxPlotTeams(
    ["BLK", "STL", "TRB", "PF"],
    avg_per_player_data,
    def_div,
    "Defensive Stats"
  );
}

function updateGraphs(
  data,
  x_axis,
  id,
  tooltip,
  title,
  from_field,
  to_field,
  select
) {
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
  ];
  if (!to_field) to_field = Infinity;
  if (!from_field) from_field = 0;
  if (to_field <= from_field) {
    return;
  }
  drawLineGraphTeams(data, x_axis, id, tooltip)

  d3.selectAll(".team_wrap").remove();

  const off_div = document.getElementById("off_div");
  const def_div = document.getElementById("def_div");
  off_div.replaceChildren();
  def_div.replaceChildren();

  const margin = { top: 25, right: 30, bottom: 30, left: 60 },
    width = 750,
    height = 400;

  // append the svg object to the body of the page
  const svg = d3
    .select(id)
    .append("svg")
    .attr("class", "team_wrap")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //Read the data
  // group the data: I want to draw one line per group
  // Add X axis --> it is a date format

  // let x = d3.scalePoint().range([0, width]).domain(statKeys);
  // svg
  //   .append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(x).ticks(5).padding([0.2]))
  //   .attr("class", "g-axes")
  //   .attr("fill","None");

  let maxes = [];
  let mins = [];
  for (let i = 0; i < statKeys.length; i++) {
    maxes.push(Math.max(...data[statKeys[i]]));
    mins.push(Math.min(...data[statKeys[i]]));
  }

  // Draw the line
  let d = width / (statKeys.length - 1);

  let teams_data = {};

  for (let k = 0; k < data[statKeys[0]].length; k++) {
    let points = [];
    let player = {};

    if (
      parseFloat(data[select][k]) >= from_field &&
      parseFloat(data[select][k]) <= to_field
    ) {
      if (!teams_data[select]) {
        for (let i = 0; i < x_axis.length; i++) {
          teams_data[x_axis[i]] = [];
        }
      } else {
        for (let i = 0; i < x_axis.length; i++) {
          teams_data[x_axis[i]].push(data[x_axis[i]][k]);
        }
      }
      for (let i = 0; i < statKeys.length; i++) {
        points.push({
          y:
            height -
            ((data[statKeys[i]][k] - mins[i]) * height) / (maxes[i] - mins[i]),
          x: d * i,
        });
      }
    }
    const dkeys = Object.keys(data);
    for (let i = 0; i < dkeys.length; i++) {
      player[dkeys[i]] = data[dkeys[i]][k];
    }
    svg
      .append("path")
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("opacity", "0.5")
      .attr("stroke-width", 1.5)
      .attr("id", "player" + player["Player"])
      .attr("d", function (d) {
        return d3
          .line()
          .x((p) => p.x + 1)
          .y((p) => p.y)(points);
      })
      .on("mouseover", function (mouse, i) {
        d3.select(this)
          .attr("stroke", "red")
          .attr("opacity", "1")
          .attr("stroke-width", 3);
        tooltip.style("opacity", 1);
        tooltip
          .html(
            "Team: " +
              getTeam(player["Tm"]).name +
              "<br>Number of players: " +
              player["NPlayers"] +
              "<br></br><b>Click to see Team details</b>"
          )
          .style("left", "0")
          .style("top", "-30px")
          .style("color", "black");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", "green")
          .attr("opacity", "0.5")
          .attr("stroke-width", 1.5);

        tooltip.style("opacity", 0).style("left", 0).style("top", 0);
      })
      .on("click", function (event) {
        location.href = "team.html?id=" + player["Tm"];
        event.stopPropagation();
      });
  }

  drawBoxPlotTeams(
    ["2P", "3P", "AST", "FT"],
    teams_data,
    off_div,
    "Offensive Stats"
  );
  drawBoxPlotTeams(
    ["BLK", "STL", "TRB", "PF"],
    teams_data,
    def_div,
    "Defensive Stats"
  );

  for (let k = 0; k < mins.length; k++) {
    const y = d3.scaleLinear().domain([mins[k], maxes[k]]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(3))
      .attr("transform", "translate(" + d * k + ",0)")
      .attr("class", "g-axes")
      .style("color", "white");
  }
}
