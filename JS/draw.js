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

function drawParallelCoordinatesPlot(){
  var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
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
  function BoxPlot(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = 0.5, // left and right inset
    insetLeft = inset, // inset for left edge of box, in pixels
    insetRight = inset, // inset for right edge of box, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    thresholds = width / 40, // approximative number of thresholds
    stroke = "currentColor", // stroke color of whiskers, median, outliers
    fill = "#ddd", // fill color of boxes
    jitter = 4, // amount of random jitter for outlier dots, in pixels
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    xLabel, // a label for the x-axis
    yLabel // a label for the y-axis
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
  
    // Filter undefined values.
    const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));
  
    // Compute the bins.
    const B = d3.bin()
        .thresholds(thresholds)
        .value(i => X[i])
      (I)
      .map(bin => {
        const y = i => Y[i];
        const min = d3.min(bin, y);
        const max = d3.max(bin, y);
        const q1 = d3.quantile(bin, 0.25, y);
        const q2 = d3.quantile(bin, 0.50, y);
        const q3 = d3.quantile(bin, 0.75, y);
        const iqr = q3 - q1; // interquartile range
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        bin.quartiles = [q1, q2, q3];
        bin.range = [r0, r1];
        bin.outliers = bin.filter(i => Y[i] < r0 || Y[i] > r1);
        return bin;
      });
  
    // Compute default domains.
    if (xDomain === undefined) xDomain = [d3.min(B, d => d.x0), d3.max(B, d => d.x1)];
    if (yDomain === undefined) yDomain = [d3.min(B, d => d.range[0]), d3.max(B, d => d.range[1])];
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(thresholds, xFormat).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    const g = svg.append("g")
      .selectAll("g")
      .data(B)
      .join("g");
  
    g.append("path")
        .attr("stroke", stroke)
        .attr("d", d => `
          M${xScale((d.x0 + d.x1) / 2)},${yScale(d.range[1])}
          V${yScale(d.range[0])}
        `);
  
    g.append("path")
        .attr("fill", fill)
        .attr("d", d => `
          M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[2])}
          H${xScale(d.x1) - insetRight}
          V${yScale(d.quartiles[0])}
          H${xScale(d.x0) + insetLeft}
          Z
        `);
  
    g.append("path")
        .attr("stroke", stroke)
        .attr("stroke-width", 2)
        .attr("d", d => `
          M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[1])}
          H${xScale(d.x1) - insetRight}
        `);
  
    g.append("g")
        .attr("fill", stroke)
        .attr("fill-opacity", 0.2)
        .attr("stroke", "none")
        .attr("transform", d => `translate(${xScale((d.x0 + d.x1) / 2)},0)`)
      .selectAll("circle")
      .data(d => d.outliers)
      .join("circle")
        .attr("r", 2)
        .attr("cx", () => (Math.random() - 0.5) * jitter)
        .attr("cy", i => yScale(Y[i]));
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
    return svg.node();
  }
}