function drawRadarPlot(
  id,
  cfg,
  axisVariables,
  data,
  tooltip,
  labels = undefined,
  players
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
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      if (i == 1 || i == 4 || i == 6 || i == 9) {
        return (
          rScale(cfg.maxValue * (cfg.labelFactor + 0.3)) *
          Math.cos(angleSlice * i - Math.PI / 10)
        );
      }
      if (i == 2 || i == 3 || i == 7 || i == 8) {
        return (
          rScale(cfg.maxValue * cfg.labelFactor) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      }
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
      .attr("x", cfg.margin)
      .attr("y", cfg.h + 70 + 30 * i)
      .attr("width", 15)
      .attr("height", 15);
    svg
      .append("text")
      .attr("x", cfg.margin + 21)
      .attr("y", cfg.h + 70 + 11 + 30 * i)
      .attr("text-anchor", "start")
      .text(labels[i]);
  }

  // // Source
  // svg
  //   .append("text")
  //   .attr("class", "source")
  //   .attr("x", cfg.width - cfg.margin / 2)
  //   .attr("y", cfg.height + 2 * cfg.margin - 20)
  //   .attr("text-anchor", "start")
  //   .text("Fonte: PORDATA, 2021");

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
