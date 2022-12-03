function addGeneralInfoPlayer(
  allPlayers,
  player1 = undefined,
  player2 = undefined,
  player3 = undefined
) {
  //Remove cards if there are not all players
  if (!player1) {
    removeCardInfo("player_attributes");
    addBtnModal("player_attributes", 1);
    removeCard("player2_attributes");
    removeCard("player3_attributes");
  }
  if (!player2) {
    removeCardInfo("player2_attributes");
    addBtnModal("player2_attributes", 2);
    removeCard("player3_attributes");
  }
  if (!player3) {
    removeCardInfo("player3_attributes");
    addBtnModal("player3_attributes", 3);
  }

  //Add events to the buttons and display only the last one
  const removeButtons = document.querySelectorAll(".player_remove");
  for (let i = 0; i < removeButtons.length; i++) {
    const button = removeButtons[i];

    //Only show the last btn
    if (i + 1 < removeButtons.length) removeButtons[i].style.display = "none";

    //Add event
    button.addEventListener("click", () => {
      const currentURL = window.location.href;
      //get number to remove
      const idToRemove = button.id.split("player")[1].split("_")[0];

      //get the id+number to remove
      const finalIdToRemove = idToRemove === "1" ? "id=" : `id${idToRemove}=`;

      const URLSplitted = currentURL.split("&");

      const elRemoveIndex = URLSplitted.findIndex((part) =>
        part.startsWith(finalIdToRemove)
      );

      const elRemoved = URLSplitted.splice(elRemoveIndex, 1);

      window.location.href = URLSplitted.join("&");
    });
  }

  // removeButtons.forEach((button) => {});

  /* ADD Names */
  //get names
  const player1Name = player1 ? player1.Player : undefined;
  const player2Name = player2 ? player2.Player : undefined;
  const player3Name = player3 ? player3.Player : undefined;

  //Create an element that contains the value of the team for each player asked
  const player1NameEl = associateValueToElement(player1Name, "span");
  const player2NameEl = associateValueToElement(player2Name, "span");
  const player3NameEl = associateValueToElement(player3Name, "span");

  //add into to the respective card
  if (player1NameEl) addInfoToCardElement("player1_name", player1NameEl);
  if (player2NameEl) addInfoToCardElement("player2_name", player2NameEl);
  if (player3NameEl) addInfoToCardElement("player3_name", player3NameEl);

  /* ADD TEAMS */
  //get Teams
  const player1Team = player1 ? getTeam(player1.Tm).name : undefined;
  const player2Team = player2 ? getTeam(player2.Tm).name : undefined;
  const player3Team = player3 ? getTeam(player3.Tm).name : undefined;

  //Create an element that contains the value of the team for each player asked
  const player1TeamEl = player1Team
    ? associateValueToElement(player1Team, "a", `./team.html?id=${player1.Tm}`)
    : undefined;
  const player2TeamEl = player2Team
    ? associateValueToElement(player2Team, "a", `./team.html?id=${player2.Tm}`)
    : undefined;
  const player3TeamEl = player3Team
    ? associateValueToElement(player3Team, "a", `./team.html?id=${player3.Tm}`)
    : undefined;

  //add into to the respective card
  if (player1TeamEl) addInfoToCardElement("player1_team", player1TeamEl);
  if (player2TeamEl) addInfoToCardElement("player2_team", player2TeamEl);
  if (player3TeamEl) addInfoToCardElement("player3_team", player3TeamEl);

  /* ADD AGES */
  //get Ages
  const player1Age = player1 ? player1.Age : undefined;
  const player2Age = player2 ? player2.Age : undefined;
  const player3Age = player3 ? player3.Age : undefined;

  //Create an element that contains the value of the team for each player asked
  const player1AgeEl = associateValueToElement(player1Age, "span");
  const player2AgeEl = associateValueToElement(player2Age, "span");
  const player3AgeEl = associateValueToElement(player3Age, "span");

  //add into to the respective card
  if (player1AgeEl) addInfoToCardElement("player1_age", player1AgeEl);
  if (player2AgeEl) addInfoToCardElement("player2_age", player2AgeEl);
  if (player3AgeEl) addInfoToCardElement("player3_age", player3AgeEl);

  /* ADD Positions */
  //get Positions
  const player1Position = player1 ? player1.Pos : undefined;
  const player2Position = player2 ? player2.Pos : undefined;
  const player3Position = player3 ? player3.Pos : undefined;

  //Create an element that contains the value of the team for each player asked
  const player1PositionEl = associateValueToElement(player1Position, "span");
  const player2PositionEl = associateValueToElement(player2Position, "span");
  const player3PositionEl = associateValueToElement(player3Position, "span");

  //add into to the respective card
  if (player1PositionEl)
    addInfoToCardElement("player1_position", player1PositionEl);
  if (player2PositionEl)
    addInfoToCardElement("player2_position", player2PositionEl);
  if (player3PositionEl)
    addInfoToCardElement("player3_position", player3PositionEl);

  //Helper functions
  function associateValueToElement(attribute, flag = "span", href = "") {
    if (!attribute) {
      return;
    }

    const element = document.createElement(flag);
    element.textContent = attribute;

    if (flag === "a") element.href = href;

    return element;
  }

  function addInfoToCardElement(ref, elementToAdd) {
    const refElement = document.getElementById(ref);
    refElement.appendChild(elementToAdd);
  }

  function removeCardInfo(ref) {
    const refElement = document.getElementById(ref);

    //remove child elements
    let childElement = refElement.lastElementChild;
    while (childElement) {
      refElement.removeChild(childElement);
      childElement = refElement.lastElementChild;
    }
  }

  function removeCard(ref) {
    const refElement = document.getElementById(ref);

    refElement.style.display = "none";
  }

  function addBtnModal(ref, number) {
    const refElement = document.getElementById(ref);

    //append wrapper for button and label
    const wrapper = document.createElement("div");
    wrapper.className = "button_wrapper";

    //append button element that opens modal
    const button = document.createElement("button");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#fff" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>`;
    button.className = "button_add_player";
    button.setAttribute("data-modal-target", "#modal");

    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal, number);
    });

    //create Label
    const label = document.createElement("p");
    label.textContent = "Add player to compare";
    label.className = "add_player_label";

    wrapper.appendChild(button);
    wrapper.append(label);
    refElement.append(wrapper);
  }

  function openModal(modal, number = -1) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
    autoCompletePlayersName(
      allPlayers,
      "player_modal_input",
      "players_modal_list",
      number
    );
  }
}

function addRadarPlot(
  data,
  player1 = undefined,
  player2 = undefined,
  player3 = undefined
) {
  //get playerStats
  const player1Stats = player1 ? getPlayerStats(player1, data) : undefined;
  const player2Stats = player2 ? getPlayerStats(player2, data) : undefined;
  const player3Stats = player3 ? getPlayerStats(player3, data) : undefined;

  //Doesn't render graphic if there are not players
  if (!player1 && !player2 && !player3) return;

  // create a tooltip
  const player_tooltip = d3
    .select("#radarPlotContainer")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  // const container = document.getElementById("radarPlotContainer");

  const w = 350;
  const h = 350;
  const margin = 120;
  const color = d3.scaleOrdinal().range(["#c92a2a", "#51cf66", "#1864ab"]);

  const starCfg = {
    w, //Width of the circle
    h, //Height of the circle
    margin, //The margins of the SVG
    levels: 4, //How many levels or inner circles should there be drawn
    maxValue: 100, //What is the value that the biggest circle will represent
    labelFactor: 1.2, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 130, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 5, //The size of the colored circles of each blog
    opacityCircles: 0.4, //The opacity of the circles of each blob
    strokeWidth: 3, //The width of the stroke around each blob
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
    color, //Color function
  };

  const axisVariables = Object.keys(player1Stats).map((a) => a);

  //array that contains the player arrays of information
  const playersStats = [];
  const labels = [];

  //array that contains player 1 information
  const player1Data = [];
  for (let i = 0; i < axisVariables.length; i++) {
    player1Data.push({
      axis: axisVariables[i],
      value: player1Stats[axisVariables[i]],
    });
  }
  playersStats.push(player1Data);
  labels.push(player1.Player);

  if (player2) {
    //array that contains player 1 information
    const player2Data = [];
    for (let i = 0; i < axisVariables.length; i++) {
      player2Data.push({
        axis: axisVariables[i],
        value: player2Stats[axisVariables[i]],
      });
    }
    playersStats.push(player2Data);
    labels.push(player2.Player);
  }
  if (player3) {
    //array that contains player 1 information
    const player3Data = [];
    for (let i = 0; i < axisVariables.length; i++) {
      player3Data.push({
        axis: axisVariables[i],
        value: player3Stats[axisVariables[i]],
      });
    }
    playersStats.push(player3Data);
    labels.push(player3.Player);
  }

  drawRadarPlot(
    "#radarPlotContainer",
    starCfg,
    axisVariables,
    playersStats,
    player_tooltip,
    [player1, player2, player3],
    labels
  );
}

function addBarPlot(
  filter,
  player1 = undefined,
  player2 = undefined,
  player3 = undefined
) {
  const filters = {
    insideScoring: {
      attr: [
        { "2PF": "Avg. 2 Points Misses" },
        { "2P": "Avg. 2 Points Goals" },
      ],
      name: "Inside Scoring",
    },
    outsideScoring: {
      attr: [
        { "3PF": "Avg. 3 Points Misses" },
        { "3P": "Avg. 3 Points Goals" },
      ],
      name: "Outside Scoring",
    },
    freeThrow: {
      attr: [
        { FTF: "Avg. Free Throw Misses" },
        { FT: "Avg. Free Throw Goals" },
      ],
      name: "Free Throw",
    },
    playmaking: { attr: [{ AST: "Avg. Assists" }], name: "Playmaking" },
    rebounding: {
      attr: [
        { ORB: "Avg. Offensive Rebounds" },
        { DRB: "Avg. Defensive Rebounds" },
      ],
      name: "Rebounding",
    },
    blocking: { attr: [{ BLK: "Avg. Blocks" }], name: "Blocking" },
    stealing: { attr: [{ STL: "Avg. Steals" }], name: "Stealing" },
  };

  const data = [];
  const selectedFilters = filters[filter].attr;

  const barPlotTitle = document.getElementById("barPlotTitle");

  barPlotTitle.textContent = `${filters[filter].name} Bar Plot`;

  if (player1) {
    const playerInfo = { Player: player1.Player };
    selectedFilters.forEach((filter) => {
      const filterKey = Object.keys(filter)[0];
      let playerValue = +player1[filterKey];

      if (filterKey === "2PF") playerValue = player1["2PA"] - player1["2P"];
      if (filterKey === "3PF") playerValue = player1["3PA"] - player1["3P"];
      if (filterKey === "FTF") playerValue = player1["FTA"] - player1["FT"];

      playerInfo[filterKey] = playerValue;
    });

    data.push(playerInfo);
  }
  if (player2) {
    const playerInfo = { Player: player2.Player };
    selectedFilters.forEach((filter) => {
      const filterKey = Object.keys(filter)[0];
      let playerValue = +player2[filterKey];

      if (filterKey === "2PF") playerValue = player2["2PA"] - player2["2P"];
      if (filterKey === "3PF") playerValue = player2["3PA"] - player2["3P"];
      if (filterKey === "FTF") playerValue = player2["FTA"] - player2["FT"];

      playerInfo[filterKey] = playerValue;
    });

    data.push(playerInfo);
  }
  if (player3) {
    const playerInfo = { Player: player3.Player };
    selectedFilters.forEach((filter) => {
      const filterKey = Object.keys(filter)[0];
      let playerValue = +player3[filterKey];

      if (filterKey === "2PF") playerValue = player3["2PA"] - player3["2P"];
      if (filterKey === "3PF") playerValue = player3["3PA"] - player3["3P"];
      if (filterKey === "FTF") playerValue = player3["FTA"] - player3["FT"];

      playerInfo[filterKey] = playerValue;
    });

    data.push(playerInfo);
  }

  console.log("data", data);

  const subgroups = data.map((d) => d.Player);
  console.log("subgroups", subgroups);

  const g = Object.keys(data[0]).splice(1);
  const groups = g.map((g, i) => filters[filter].attr[i][g]);
  console.log("groups", groups);

  let maxValue = 0;
  data.forEach((d) => {
    const keys = Object.keys(data[0]);
    keys.forEach((key) => {
      if (typeof d[key] === "number" && d[key] > maxValue)
        maxValue = Math.ceil(d[key]);
    });
  });

  console.log("maxValue", maxValue);

  // set the dimensions and margins of the graph
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 80, bottom: 20, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  //clear everything inside bar plot Div
  document.getElementById("barPlot").replaceChildren();

  // append the svg object to the body of the page
  const svg = d3
    .select("#barPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right * 2)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  console.log("GROUpS", groups);
  // Add X axis
  const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);
  // color palette = one color per subgroup
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#c92a2a", "#51cf66", "#1864ab"]);

  // ----------------
  // Create a tooltip
  // ----------------
  const tooltip = d3
    .select("#barPlot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Three function that change the tooltip when user hover / move / leave a cell
  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (event, d) {
    console.log("event", event);
    const subgroupName = d.key;
    const subgroupValue = d.value;

    tooltip
      .html(
        "Name: " +
          subgroupName +
          "<br>" +
          "Value: " +
          Number.parseFloat(subgroupValue).toFixed(1)
      )
      .style("opacity", 1)
      .style("color", "#000");
  };
  const mousemove = function (event, d) {
    tooltip
      .style("transform", "translateY(-55%)")
      .style("left", event.x / 2 + "px")
      .style("top", event.y / 2 - 30 + "px");
  };
  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
  };

  // // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(selectedFilters)
    .join("g")
    .attr("transform", (d) => `translate(${x(Object.values(d)[0])}, 0)`)
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key, i) {
        const attr = Object.keys(d)[0];
        return { key: key, value: data[i][attr] };
      });
    })
    .join("rect")
    .attr("x", (d) => xSubgroup(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d.key))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  for (let i = 0; i < subgroups.length; i++) {
    svg
      .append("rect")
      .style("fill", color(subgroups[i]))
      .attr("x", width - margin.right + 120)
      .attr("y", height / 2 + 30 * i)
      .attr("width", 15)
      .attr("height", 15);
    svg
      .append("text")
      .attr("x", width - margin.right + 120 + 21)
      .attr("y", height / 2 + 11 + 30 * i)
      .attr("text-anchor", "start")
      .text(subgroups[i]);
  }
}
