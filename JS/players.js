function autoCompletePlayersName(players, inputRef, listRef, compareId = -1) {
  //get Array with Players names and sort
  const playersNames = players.map((p) => p.Player).sort();

  //reference
  let playerInput = document.getElementById(inputRef);

  //Execute function on keyup
  playerInput.addEventListener("keyup", () => {
    //loop through above array
    //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
    removeElements();

    for (let player of playersNames) {
      //convert input to lowercase and compare with each string
      if (
        player.toLowerCase().startsWith(playerInput.value.toLowerCase()) &&
        playerInput.value != ""
      ) {
        //create li element
        const listItem = document.createElement("li");
        listItem.classList.add("plist-item");

        //Display matched part in bold
        const match = document.createElement("b");
        match.textContent = player.substr(0, playerInput.value.length);

        //Display unmatched part in regular
        const rest = document.createElement("p");
        rest.textContent = player.substr(playerInput.value.length);

        //Create link element that contains player name
        const playerLink =
          compareId === -1
            ? document.createElement("a")
            : document.createElement("p");

        //if a compareId is sent, it means it comes from the modal, and it will be a button that appends player to url
        if (compareId === -1) {
          playerLink.href = `./player.html?&id=${player}`;
        } else {
          playerLink.addEventListener("click", () => {
            const currentURL = window.location.href;
            window.location.href = `${currentURL}&id${
              compareId === 1 ? "" : compareId
            }=${player}`;
          });
        }
        playerLink.appendChild(match);
        playerLink.appendChild(rest);

        //add link to listItem and add it to the global List
        listItem.appendChild(playerLink);
        const playersList = document.getElementById(listRef);
        playersList.appendChild(listItem);
      }
    }
  });

  function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".plist-item");
    items.forEach((item) => {
      item.remove();
    });
  }
}

function addParalelPlayersPlot(data, filters) {
  //clear everything inside bar plot Div
  document.getElementById("paralelPlayers").replaceChildren();

  console.log("filters", filters);

  if (filters.team !== "all") {
    data = data.filter((d) => d.Tm === filters.team);
  }

  console.log("data", data);

  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 50, bottom: 20, left: 20 },
    width = 750,
    height = 400;

  // append the svg object to the body of the page
  const svg = d3
    .select("#paralelPlayers")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom * 2)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Color scale: give me a specie name, I return a color
  const color = d3
    .scaleOrdinal()
    .domain(["C", "PF", "SF", "PG", "SG"])
    .range(["red", "green", "#fde725ff", "#21238df3", "#71208dff"]);

  // Here I set the list of dimension manually to control the order of axis:
  const dimensions = {
    Rk: "Rank",
    Age: "Age",
    G: "Games",
    "3P%": "Avg. 3P%",
    "2P%": "Avg. 2P%",
    "FT%": "Avg. FT%",
    TRB: "Avg. Rebounds",
    AST: "Avg. Assists",
    STL: "Avg. Steals",
    BLK: "Avg. Blocks",
    TOV: "Avg. Turnovers",
    PF: "Avg. Fouls",
    PTS: "Avg. Points",
  };

  // For each dimension, I build a linear scale. I store all in a y object
  const y = {};

  for (let i in Object.keys(dimensions)) {
    const dimension = Object.keys(dimensions)[i];

    const dimensionArray = data.map((d) => +d[dimension]);
    const dimensionDomain = d3.extent(dimensionArray);

    let max = dimensionDomain[1];

    y[dimension] = d3.scaleLinear().domain([0, max]).range([height, 0]);
  }

  // Build the X scale -> it find the best position for each Y axis
  console.log("Object keys", Object.keys(dimensions));
  const x = d3.scalePoint().range([0, width]).domain(Object.keys(dimensions));

  // Highlight the specie that is hovered
  const highlight = function (event, d) {
    // console.log("d", d);
    const selectedPosition = d.Pos;
    console.log(selectedPosition);

    // first every group turns grey
    d3.selectAll(".line")
      .transition()
      .duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2");
    // Second the hovered specie takes its color
    d3.selectAll("." + selectedPosition)
      .transition()
      .duration(200)
      .style("stroke", color(selectedPosition))
      .style("opacity", "1");
  };

  // Unhighlight
  const doNotHighlight = function (event, d) {
    d3.selectAll(".line")
      .transition()
      .duration(200)
      .delay(1000)
      .style("stroke", function (d) {
        return color(d.Pos);
      })
      .style("opacity", "1");
  };

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(
      Object.keys(dimensions).map(function (p) {
        // console.log(p);
        return [x(p), y[p](d[p])];
      })
    );
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .join("path")
    .attr("class", function (d) {
      return "line " + d.Pos;
    }) // 2 class for each line: 'line' and the group name
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function (d) {
      return color(d.Pos);
    })
    .style("opacity", 0.5)
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight);

  // Draw the axis:
  svg
    .selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(Object.keys(dimensions))
    .enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function (d) {
      return `translate(${x(d)})`;
    })
    // And I build the axis with the call function
    .each(function (d) {
      console.log(y[d]);
      d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
    })
    // Add axis title
    .append("text")
    .style("text-anchor", "middle")
    .style("font-size", "8px")
    .attr("y", height + margin.bottom)
    .text(function (d) {
      console.log("d", d);
      return dimensions[d];
    })
    .style("fill", "white");
}
