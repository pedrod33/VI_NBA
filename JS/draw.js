function drawRadarPlot(id, cfg, axisVariables, data, tooltip) {
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
      .attr("stdDeviation", "2.5")
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
    .attr("fill", "#737373")
    .text(function (d, i) {
      return d3.format((cfg.maxValue * d) / cfg.levels);
    });

  // ------- Draw the axes ---------

  console.log("axisVariables", axisVariables);

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
          rScale(cfg.maxValue * (cfg.labelFactor + 0.4)) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      }
      if (i == 2 || i == 3 || i == 7 || i == 8) {
        return (
          rScale(cfg.maxValue * (cfg.labelFactor + 0.22)) *
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
        return { year: i, ...circle_data };
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
      return cfg.color(d.year);
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
        return { year: i, ...circle_data };
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
      year_to_tooltip = 1;
      if (i.year == 1) year_to_tooltip = 1;

      tooltip.style("opacity", 1);

      tooltip
        .html("Ano: " + year_to_tooltip + "<br>Nota: " + i.value)
        .style("left", cfg.w / 2 + d3.pointer(mouse)[0] + cfg.margin / 2 + "px")
        .style("top", d3.pointer(mouse)[1] + 2 * cfg.margin + 10 + "px")
        .style("color", "black");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0).style("left", 0).style("top", 0);
    });

  console.log("data", data);

  if (data.length > 1) {
    svg
      .append("rect")
      .style("fill", cfg.color(1))
      .attr("x", cfg.width + (2 / 3) * cfg.margin)
      .attr("y", cfg.height / 3)
      .attr("width", 15)
      .attr("height", 15);
    svg
      .append("text")
      .attr("x", cfg.width + (2 / 3) * cfg.margin + 21)
      .attr("y", cfg.height / 3 + 11)
      .attr("text-anchor", "start")
      .text("1");
  }

  svg
    .append("rect")
    .style("fill", cfg.color(0))
    .attr("x", cfg.width + (2 / 3) * cfg.margin)
    .attr("y", cfg.height / 3 + 30)
    .attr("width", 15)
    .attr("height", 15);
  svg
    .append("text")
    .attr("x", cfg.width + (2 / 3) * cfg.margin + 21)
    .attr("y", cfg.height / 3 + 41)
    .attr("text-anchor", "start")
    .text(2);

  // Title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", cfg.width / 2 + cfg.margin)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Média das notas dos exames de secundário");

  // Source
  svg
    .append("text")
    .attr("class", "source")
    .attr("x", cfg.width - cfg.margin / 2)
    .attr("y", cfg.height + 2 * cfg.margin - 20)
    .attr("text-anchor", "start")
    .text("Fonte: PORDATA, 2021");

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

function drawParallelCoordinatesPlot(data, id){
  var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(id)
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"]

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( [0,8] ) // --> Same axis range for each group
      // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.Species

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.Species))} )
      .style("opacity", "1")
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.Species } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.Species))} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

})
}


//---------------------------------line-graph-------------------------------


function drawLineGraph(data,id){
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(id)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
  console.log(data)
  //Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {
  console.log
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.name); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.year; }))
  .range([ 0, width ]);
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.n; })])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  svg.selectAll(".line")
    .data(sumstat)
    .join("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d[0]) })
      .attr("stroke-width", 1.5)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(+d.n); })
          (d[1])
      })

  })
}

function drawRadarPlot(id, cfg, axisVariables, data, tooltip) {
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
      .attr("stdDeviation", "2.5")
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
    .attr("fill", "#737373")
    .text(function (d, i) {
      return d3.format((cfg.maxValue * d) / cfg.levels);
    });

  // ------- Draw the axes ---------

  console.log("axisVariables", axisVariables);

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
          rScale(cfg.maxValue * (cfg.labelFactor + 0.4)) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      }
      if (i == 2 || i == 3 || i == 7 || i == 8) {
        return (
          rScale(cfg.maxValue * (cfg.labelFactor + 0.22)) *
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
        return { year: i, ...circle_data };
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
      return cfg.color(d.year);
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
        return { year: i, ...circle_data };
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
      year_to_tooltip = 1;
      if (i.year == 1) year_to_tooltip = 1;

      tooltip.style("opacity", 1);

      tooltip
        .html("Ano: " + year_to_tooltip + "<br>Nota: " + i.value)
        .style("left", cfg.w / 2 + d3.pointer(mouse)[0] + cfg.margin / 2 + "px")
        .style("top", d3.pointer(mouse)[1] + 2 * cfg.margin + 10 + "px")
        .style("color", "black");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0).style("left", 0).style("top", 0);
    });

  console.log("data", data);

  if (data.length > 1) {
    svg
      .append("rect")
      .style("fill", cfg.color(1))
      .attr("x", cfg.width + (2 / 3) * cfg.margin)
      .attr("y", cfg.height / 3)
      .attr("width", 15)
      .attr("height", 15);
    svg
      .append("text")
      .attr("x", cfg.width + (2 / 3) * cfg.margin + 21)
      .attr("y", cfg.height / 3 + 11)
      .attr("text-anchor", "start")
      .text("1");
  }

  svg
    .append("rect")
    .style("fill", cfg.color(0))
    .attr("x", cfg.width + (2 / 3) * cfg.margin)
    .attr("y", cfg.height / 3 + 30)
    .attr("width", 15)
    .attr("height", 15);
  svg
    .append("text")
    .attr("x", cfg.width + (2 / 3) * cfg.margin + 21)
    .attr("y", cfg.height / 3 + 41)
    .attr("text-anchor", "start")
    .text(2);

  // Title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", cfg.width / 2 + cfg.margin)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Média das notas dos exames de secundário");

  // Source
  svg
    .append("text")
    .attr("class", "source")
    .attr("x", cfg.width - cfg.margin / 2)
    .attr("y", cfg.height + 2 * cfg.margin - 20)
    .attr("text-anchor", "start")
    .text("Fonte: PORDATA, 2021");

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

function drawParallelCoordinatesPlot(data, id){
  var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(id)
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Here I set the list of dimension manually to control the order of axis:
  dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"]

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( [0,8] ) // --> Same axis range for each group
      // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.Species

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.Species))} )
      .style("opacity", "1")
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
      .attr("class", function (d) { return "line " + d.Species } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ return( color(d.Species))} )
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

})
}


//---------------------------------line-graph-------------------------------


function drawLineGraph(data,x_axis,id){
  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 460 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(id)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
  
  //Read the data
  // group the data: I want to draw one line per group
  // Add X axis --> it is a date format

  let x = d3.scalePoint()
      .range([0, width])
      .domain(x_axis);
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0,40])
  .range([height, 0]);
  svg.append("g")
  .call(d3.axisLeft(y));
  // color palette
  const color = d3.scaleOrdinal()
  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  let d = width/(x_axis.length-1);
  console.log(data)
  for (let k=0;k<data[x_axis[0]].length;k++){

    let points = [];
    for (let i=0;i<x_axis.length;i++){
      points.push({'y': height-data[x_axis[i]][k]*height/40,'x': d*i})
    }
    console.log(points)

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(p => p.x+1)
            .y(p => p.y)(points)
    })
  }
}