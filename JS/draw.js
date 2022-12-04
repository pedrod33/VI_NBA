function drawRadarPlot(
  id,
  cfg,
  axisVariables,
  data,
  tooltip,
  players,
  labels = undefined
) {
  //Radius of the outermost circle
  const radius = Math.min(cfg.w / 2, cfg.h / 2);
  //The width in radians of each "slice"
  const angleSlice = (Math.PI * 2) / axisVariables.length;
  //Scale for the radius
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, cfg.maxValue]);

  // ------- Create the container SVG and Group ---------
  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();
  //Initiate the radar chart SVG
  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.margin + cfg.margin)
    .attr("height", cfg.h + cfg.margin + cfg.margin)
    .attr("class", "radar" + id);
  //Append a g element
  const g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (cfg.w / 2 + cfg.margin) +
        "," +
        (cfg.h / 2 + cfg.margin) +
        ")"
    );

  // ------- Glow filter ---------
  //Filter for the outside glow
  const filter = g.append("defs").append("filter").attr("id", "glow"),
    feGaussianBlur = filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "1.5")
      .attr("result", "coloredBlur"),
    feMerge = filter.append("feMerge"),
    feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
    feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  // ------- Draw the Circular Grid ---------
  //Wrapper for the grid & axes
  const axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / cfg.levels) * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / cfg.levels;
    })
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .attr("fill", "#fff")
    .text(function (d, i) {
      return d3.format((cfg.maxValue * d) / cfg.levels);
    });

  // ------- Draw the axes ---------
  //Create the straight lines radiating outward from the center
  const axis = axisGrid
    .selectAll(".axis")
    .data(axisVariables)
    .enter()
    .append("g")
    .attr("class", "axis");

  //Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return (
        rScale(cfg.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y2", function (d, i) {
      return (
        rScale(cfg.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .style("cursor", "pointer")
    .attr("title", "Click to see in the bar plot below")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .on("click", (d, key) => {
      const barPlotFilter = document.getElementById("barPlotFilter");

      barPlotFilter.value = key;
      console.log("players", players);
      addBarPlot(key, players[0], players[1], players[2]);
    })
    .attr("x", function (d, i) {
      return (
        rScale(cfg.maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        rScale(cfg.maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    })
    .call(wrap, cfg.wrapWidth);

  // ------- Draw the radar chart blobs ---------
  //The radial line function
  const radarLine = d3
    .lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function (d) {
      return rScale(d.value);
    })
    .angle(function (d, i) {
      return i * angleSlice;
    });

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }

  //Create a wrapper for the blobs
  const blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("fill", function (d, i) {
      return cfg.color(i);
    })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function (d, i) {
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this).transition().duration(200).style("fill-opacity", 0.8);
    })
    .on("mouseout", function () {
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function (d, i) {
      return cfg.color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d.map(function (circle_data) {
        return { player: i, ...circle_data };
      });
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return cfg.color(d.player);
    })
    .style("fill-opacity", 0.8);

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d.map(function (circle_data) {
        return { player: i, ...circle_data };
      });
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function (d, i) {
      return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (mouse, i) {
      const player = players[i.player];

      tooltip.style("opacity", 1);

      tooltip
        .html("Player: " + player.Player + "<br>" + i.axis + ":" + i.value)
        .style("left", cfg.w / 2 + d3.pointer(mouse)[0] + cfg.margin / 2 + "px")
        .style("top", mouse.clientY - cfg.margin + "px")
        .style("color", "black");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0).style("left", 0).style("top", 0);
    });

  for (let i = 0; i < labels.length; i++) {
    svg
      .append("rect")
      .style("fill", cfg.color(i))
      .attr("x", cfg.w + cfg.margin + 10)
      .attr("y", cfg.h + 75 + 30 * i)
      .attr("width", 15)
      .attr("height", 15);
    svg
      .append("text")
      .attr("x", cfg.w + cfg.margin + 10 + 21)
      .attr("y", cfg.h + 75 + 11 + 30 * i)
      .attr("text-anchor", "start")
      .text(labels[i]);
  }

  // // Source
  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  } //wrap
} //RadarChart

//---------------------------line-graph---------------------------

function drawLineGraph(data, x_axis, id, tooltip, title) {
  // set the dimensions and margins of the graph
  const margin = { top: 25, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("text")
    .text(title)
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "white");

  //Read the data
  // group the data: I want to draw one line per group
  // Add X axis --> it is a date format

  let x = d3.scalePoint().range([0, width]).domain(x_axis);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  const dkeys = Object.keys(data);
  let maxes = [];
  let mins = [];
  for (let i = 0; i < x_axis.length; i++) {
    maxes.push(Math.max(...data[x_axis[i]]));
    mins.push(Math.min(...data[x_axis[i]]));
  }
  //tm = Math.ceil(tm+1);
  // Add Y axis

  // color palette
  // const color = d3.scaleOrdinal()
  // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  let d = width / (x_axis.length - 1);
  for (let k = 0; k < data[x_axis[0]].length; k++) {
    // svg.append("line")
    //   .style("stroke", '#e41a1c')  // colour the line
    //   .style("opacity","0.7")
    //   .attr("x1", d*k)     // x position of the first end of the line
    //   .attr("y1", height)      // y position of the first end of the line
    //   .attr("x2", d*k)     // x position of the second end of the line
    //   .attr("y2", 0);

    let points = [];
    let player = {};
    for (let i = 0; i < x_axis.length; i++) {
      // console.log(data[x_axis[i]][k]>=mins[i])
      // console.log(data[x_axis[i]][k]<=maxes[i])
      points.push({
        y:
          height -
          ((data[x_axis[i]][k] - mins[i]) * height) / (maxes[i] - mins[i]),
        x: d * i,
      });
    }
    const dkeys = Object.keys(data);
    for (let i = 0; i < dkeys.length; i++) {
      player[dkeys[i]] = data[dkeys[i]][k];
    }

    svg
      .append("path")
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

        tooltip
          .style("opacity", 1)
          .html("Player: " + player["Player"])
          .style(
            "left",
            window.screen.width / 2 + d3.pointer(mouse)[0] + 76 + "px"
          )
          .style("top", d3.pointer(mouse)[1] + 20 + "px")
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
        location.href = "player.html?id=" + player["Player"];
        event.stopPropagation();
      });
  }
  for (let k = 0; k < mins.length; k++) {
    const y = d3.scaleLinear().domain([mins[k], maxes[k]]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(3).tickValues([mins[k], maxes[k]]))
      .attr("transform", "translate(" + d * k + ",0)")
      .style("color", "white");
  }
}

function drawLineGraphTeams(data, x_axis, id, tooltip) {
  // set the dimensions and margins of the graph
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

  // svg
  //   .append("text")
  //   .text(title)
  //   .attr("x", width / 2)
  //   .attr("y", -10)
  //   .attr("text-anchor", "middle")
  //   .style("font-size", "20px")
  //   .style("fill", "white");

  //Read the data
  // group the data: I want to draw one line per group
  // Add X axis --> it is a date format

  let x = d3.scalePoint().range([0, width]).domain(x_axis);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .attr("class", "g-axes");

  const dkeys = Object.keys(data);
  let maxes = [];
  let mins = [];
  for (let i = 0; i < x_axis.length; i++) {
    maxes.push(Math.max(...data[x_axis[i]]));
    mins.push(Math.min(...data[x_axis[i]]));
  }
  //tm = Math.ceil(tm+1);
  // Add Y axis

  // color palette
  // const color = d3.scaleOrdinal()
  // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  let d = width / (x_axis.length - 1);

  for (let k = 0; k < data[x_axis[0]].length; k++) {
    // svg.append("line")
    //   .style("stroke", '#e41a1c')  // colour the line
    //   .style("opacity","0.7")
    //   .attr("x1", d*k)     // x position of the first end of the line
    //   .attr("y1", height)      // y position of the first end of the line
    //   .attr("x2", d*k)     // x position of the second end of the line
    //   .attr("y2", 0);

    let points = [];
    let player = {};
    for (let i = 0; i < x_axis.length; i++) {
      // console.log(data[x_axis[i]][k]>=mins[i])
      // console.log(data[x_axis[i]][k]<=maxes[i])
      points.push({
        y:
          height -
          ((data[x_axis[i]][k] - mins[i]) * height) / (maxes[i] - mins[i]),
        x: d * i,
      });
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
  for (let k = 0; k < mins.length; k++) {
    const y = d3.scaleLinear().domain([mins[k], maxes[k]]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(3).tickValues([mins[k], maxes[k]]))
      .attr("transform", "translate(" + d * k + ",0)")
      .attr("class", "g-axes")
      .style("color", "white");
  }
}

//---------------------------drawBoxPlot---------------------------
function drawBoxPlot(stats, data, id, title) {
  const margin = { top: 20, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "white")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("text")
    .text(title)
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("fill", "white");
  let skeys = Object.keys(stats);
  let max_val,
    min_val,
    med_val,
    q1_val,
    q3_val,
    total_max = -1;

  for (let i = 0; i < Object.keys(stats).length; i++) {
    let d_stats = data[skeys[i]];
    min_val = d_stats[0];
    max_val = d_stats[d_stats.length - 1];
    if (max_val > total_max) {
      total_max = max_val;
    }
    if (d_stats.length % 2) med_val = d_stats[Math.floor(d_stats.length / 2)];
    else {
      med_val =
        (d_stats[d_stats.length / 2] + d_stats[d_stats.length / 2 - 1]) / 2;
    }

    if (d_stats.length % 4) {
      q1_val = d_stats[Math.floor(d_stats.length / 4)];
      q3_val = d_stats[Math.floor((d_stats.length * 3) / 4)];
    } else {
      q1_val =
        (d_stats[d_stats.length / 4] + d_stats[d_stats.length / 4 - 1]) / 2;
      q3_val =
        (d_stats[(d_stats.length * 3) / 4] +
          d_stats[(d_stats.length * 3) / 4 - 1]) /
        2;
    }
    stats[skeys[i]]["min"] = min_val;
    stats[skeys[i]]["q1"] = q1_val;
    stats[skeys[i]]["med"] = med_val;
    stats[skeys[i]]["q3"] = q3_val;
    stats[skeys[i]]["max"] = max_val;
  }
  let x = d3.scaleBand().range([0, width]).domain(skeys);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  total_max = Math.ceil(total_max);
  const y = d3.scaleLinear().domain([0, total_max]).range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  drawBox(skeys, stats, total_max, width, height, svg);
}

function drawBoxPlotTeams(stats, data, id, title) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 350,
    height = 250;
  // console.log(data);
  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "white")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  let max_val,
    min_val,
    med_val,
    q1_val,
    q3_val,
    total_max = -1;
  let proc_data = {};
  for (let i = 0; i < Object.keys(stats).length; i++) {
    if (typeof data[stats[i]] == "undefined") {
      return;
    }
    let d_stats = structuredClone(data[stats[i]]);
    // console.log(data[stats[i]]);
    d_stats.sort(function (a, b) {
      return a - b;
    });
    min_val = Math.max(...d_stats);
    min_val = Math.min(...d_stats);
    min_val = d_stats[0];
    max_val = d_stats[d_stats.length - 1];
    if (max_val > total_max) {
      total_max = max_val;
    }
    if (d_stats.length % 2) med_val = d_stats[Math.floor(d_stats.length / 2)];
    else {
      med_val =
        (d_stats[d_stats.length / 2] + d_stats[d_stats.length / 2 - 1]) / 2;
    }

    if (d_stats.length % 4) {
      q1_val = d_stats[Math.floor(d_stats.length / 4)];
      q3_val = d_stats[Math.floor((d_stats.length * 3) / 4)];
    } else {
      q1_val =
        (d_stats[d_stats.length / 4] + d_stats[d_stats.length / 4 - 1]) / 2;
      q3_val =
        (d_stats[(d_stats.length * 3) / 4] +
          d_stats[(d_stats.length * 3) / 4 - 1]) /
        2;
    }
    proc_data[stats[i]] = {};
    proc_data[stats[i]]["min"] = min_val;
    proc_data[stats[i]]["q1"] = q1_val;
    proc_data[stats[i]]["med"] = med_val;
    proc_data[stats[i]]["q3"] = q3_val;
    proc_data[stats[i]]["max"] = max_val;
  }
  let x = d3.scaleBand().range([0, width]).domain(stats);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  total_max = Math.ceil(total_max);
  const y = d3.scaleLinear().domain([0, total_max]).range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  drawBox(stats, proc_data, total_max, width, height, svg);
}

//auxiliar to drawBoxPlot
function drawBox(skeys, stats, total_max, width, height, svg) {
  let division = width / skeys.length;
  for (let i = 0; i < skeys.length; i++) {
    svg
      .append("rect")
      .attr("x", division / 4 + division * i)
      .attr("y", height - height * (stats[skeys[i]]["q3"] / total_max))
      .attr("width", division / 2)
      .attr(
        "height",
        (height * (stats[skeys[i]]["q3"] - stats[skeys[i]]["q1"])) / total_max
      )
      .attr("stroke", "black")
      .attr("fill", "#69a3b2");

    svg
      .append("line")
      .style("stroke", "white") // colour the line
      .attr("x1", division / 2 - division / 10 + i * division) // x position of the first end of the line
      .attr("y1", height - (stats[skeys[i]]["min"] * height) / total_max) // y position of the first end of the line
      .attr("x2", division / 2 + division / 10 + i * division) // x position of the second end of the line
      .attr("y2", height - (stats[skeys[i]]["min"] * height) / total_max);

    svg
      .append("line")
      .style("stroke", "white") // colour the line
      .attr("x1", division / 2 - division / 10 + i * division) // x position of the first end of the line
      .attr("y1", height - (stats[skeys[i]]["max"] * height) / total_max) // y position of the first end of the line
      .attr("x2", division / 2 + division / 10 + i * division) // x position of the second end of the line
      .attr("y2", height - (stats[skeys[i]]["max"] * height) / total_max);

    svg
      .append("line")
      .style("stroke", "white") // colour the line
      .attr("x1", division / 4 + i * division) // x position of the first end of the line
      .attr("y1", height - (stats[skeys[i]]["med"] * height) / total_max) // y position of the first end of the line
      .attr("x2", (3 * division) / 4 + i * division) // x position of the second end of the line
      .attr("y2", height - (stats[skeys[i]]["med"] * height) / total_max);

    svg
      .append("line")
      .style("stroke", "white") // colour the line
      .attr("x1", division / 2 + i * division) // x position of the first end of the line
      .attr("y1", height - (stats[skeys[i]]["min"] * height) / total_max) // y position of the first end of the line
      .attr("x2", division / 2 + i * division) // x position of the second end of the line
      .attr("y2", height - (stats[skeys[i]]["max"] * height) / total_max);
  }
}
