function addTeams(data) {
  //get all Teams going trough all players
  const teams = [];
  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i].Tm)) teams.push(data[i].Tm);
  }

  //add teams
  //filterTeams(teams.sort(), "");

  //reference
  let teamInput = document.getElementById("team_input");
  //Execute function on keyup to filter teams
  teamsStats(data)
  teamInput.addEventListener("keyup", () => {
    removeElements();
    filterTeams(teams.sort(), teamInput.value, data);
  });

  function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".tlist-item");
    items.forEach((item) => {
      item.remove();
    });
  }
}

function filterTeams(teams, filter, data) {
  //create all teams cards
  
  const parent_div = document.getElementById("teams_content");
  if(filter!=""){
      const team_stats = document.getElementById("stats_wrapper");
      if(team_stats){
        team_stats.remove();
      }
      const team_list = document.createElement("ul");
      team_list.id = "teams_list";
      team_list.className = "teams_list";
      
      parent_div.appendChild(team_list)
      for (let team of teams) {
        const teamInfo = getTeam(team);
      if (
        teamInfo.name.toLowerCase().startsWith(filter.toLowerCase())
        ) {
          //create li element
        const listItem = document.createElement("li");
        listItem.classList.add("tlist-item");

        //Create img element of team
        const teamImg = document.createElement("img");
        teamImg.src = teamInfo.image;
        teamImg.alt = 'Logo of team ${teamInfo.name}';
        
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
  }
  else{
    teamsStats(data)
  }
}


function boxStats(data,stats_wrapper,off_stats,def_stats,tooltip){
  const off_div = document.createElement("div");
    off_div.style.width = "50%";
    off_div.style.display = "inline-block";
    off_div.style.height = "50%";
    off_div.style.marginTop = "30px"
    off_div.id="off_div";
  stats_wrapper.appendChild(off_div);
  const def_div = document.createElement("div");
    def_div.style.width = "50%";
    def_div.style.display = "inline-block";
    def_div.style.height = "50%";
    def_div.style.marginTop = "30px"
    def_div.id="def_div";

  stats_wrapper.appendChild(def_div);
  drawBoxPlotTeams(off_stats,data,off_div,"Offensive Stats",tooltip,false)
  drawBoxPlotTeams(def_stats,data,def_div,"Defensive Stats",tooltip,true)
}

function teamsStats(data){
  const parent_div = document.getElementById("teams_content");
  let statKeys = ["Age","G","MP","PTS","2P", "3P", "AST","BLK","FG","FT","STL","TOV","TRB","DRB","ORB","PF"]
  let x_axis = ["Age","G","MP","PTS","2P", "3P", "AST","BLK","FG","FT","STL","TOV","TRB"]

  const dings = ["Age","PTS", "BLK", "AST", "TOV", "TRB"]
  const team_list = document.getElementById("teams_list");
  if(team_list){
    team_list.remove();
  }
  
  let [team_total_data,  avg_per_player_data]= teamData(data);
  
  const stats_wrapper = document.createElement("div");
  stats_wrapper.id = "stats_wrapper";
  parent_div.appendChild(stats_wrapper);
  
  const filters = document.createElement("div")
  filters.id = "filters_div";
  filters.style.width = "30%"
  filters.style.display = "inline-block";
  stats_wrapper.appendChild(filters)

  const line_graph_div = document.createElement("div");
  line_graph_div.style.width = "70%";
  line_graph_div.style.height = "50%";
  line_graph_div.style.display = "inline-block";
  line_graph_div.id = "team_line_graph_id";
  stats_wrapper.appendChild(line_graph_div);

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

  const text = document.createElement("b");
  text.innerHTML = "Filters:";
  text.style.color = "white";
  text.style.fontSize = "15px";
  const select = document.createElement("select")
  for(let x in dings){
    let option = document.createElement("option");
    option.text = dings[x];
    select.add(option);

  }
  const from_field = document.createElement("input");
  const to_field = document.createElement("input");
  select.id="filter selection"
  select.addEventListener("input", 
  function(){
    if(from_field.value!="" || to_field.value!="")
      updateGraphs(avg_per_player_data, statKeys, line_graph_div, tooltip, "Team Stats", from_field.value, to_field.value, select.value)
  })
  select.style.marginLeft = "10px"
  //select.innerHTML ="<br>"
  
  from_field.placeholder = "From";
  from_field.id = "from_field";
  from_field.style.maxWidth = "70px";
  to_field.placeholder = "To";
  to_field.id = "to_field";
  to_field.style.maxWidth = "70px";
  to_field.style.marginLeft = "10px"
  from_field.addEventListener("input",function(){updateGraphs(avg_per_player_data, statKeys, line_graph_div, tooltip, "Team Stats", from_field.value, to_field.value,select.value)})
  to_field.addEventListener("input",function(){updateGraphs(avg_per_player_data, statKeys, line_graph_div, tooltip, "Team Stats", from_field.value, to_field.value,select.value)})

  filters.appendChild(text)
  filters.appendChild(select)
  filters.appendChild(document.createElement("br"));
  filters.appendChild(from_field)
  filters.appendChild(to_field)
    
  drawLineGraphTeams(avg_per_player_data, x_axis, line_graph_div, tooltip, "Team Stats");

  boxStats(avg_per_player_data,stats_wrapper, ["2P","3P","AST","FT","ORB"],["BLK","STL","DRB","PF"],tooltip)
}


function updateGraphs(data, x_axis, id, tooltip,title,from_field,to_field,select){
  let statKeys = ["Age","G","MP","PTS","2P", "3P", "AST","BLK","FG","FT","STL","TOV","TRB"]

  if(isNaN(to_field)||isNaN(from_field) || parseFloat(to_field)<=parseFloat(from_field)){
    return
  }
  if(to_field==""){
    to_field=Infinity;
  }
  if(from_field==""){
    from_field=0;
  }
  from_field = parseFloat(from_field)
  to_field = parseFloat(to_field)
  
  d3.selectAll(".team_wrap").remove()
  d3.select("#def_div").remove()
  d3.select("#off_div").remove()

  const margin = {top: 25, right: 30, bottom: 30, left: 60},
  width = 700 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(id)
  .append("svg").attr("class","team_wrap")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

  svg.append("text")
  .text(title)
  .attr("x",width/2)
  .attr("y",-10)
  .attr("text-anchor","middle")
  .style("font-size","20px")
  .style("fill","white");

  //Read the data
  // group the data: I want to draw one line per group
  // Add X axis --> it is a date format

  let x = d3.scalePoint()
    .range([0, width])
    .domain(statKeys);
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5))
  .attr("class","g-axes");
  
  let maxes = [];
  let mins = [];
  for(let i=0;i<statKeys.length;i++){
    maxes.push(Math.max(...data[statKeys[i]]));
    mins.push(Math.min(...data[statKeys[i]]));
  }
  
  // Draw the line
  let d = width/(statKeys.length-1);
  
  let teams_data = {};
  console.log(data)
  for (let k=0;k<data[statKeys[0]].length;k++){
    
    
    let points = [];
    let player = {};
    if(parseFloat(data[select][k])>=from_field && parseFloat(data[select][k])<=to_field){
      if(!teams_data[select]){
        for (let i=0;i<x_axis.length;i++){
          teams_data[x_axis[i]]=[];
        }
      }
      else{
        for (let i=0;i<x_axis.length;i++){

          teams_data[x_axis[i]].push(data[x_axis[i]][k]);
        }
      }
      for (let i=0;i<statKeys.length;i++){
        points.push({'y': height-(data[statKeys[i]][k]-mins[i])*height/(maxes[i]-mins[i]),'x': d*i})
  
      }
    }
    const dkeys = Object.keys(data);
    for (let i=0;i<dkeys.length;i++){
      player[dkeys[i]] = data[dkeys[i]][k];
    }
    svg.append("path")
    .attr("class","line-path")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("opacity","0.5")
    .attr("stroke-width", 1.5)
    .attr("id","player"+player["Player"])
    .attr("d", function(d){
      return d3.line()
      .x(p => p.x+1)
      .y(p => p.y)(points)
    })
    .on("mouseover", function (mouse, i) {
      d3.select(this)
      .attr("stroke","red")
      .attr("opacity","1")
      .attr("stroke-width", 3)
      tooltip
        .style("opacity", 1)
        .html("Team: " + getTeam(player["Tm"]).name + "<br>Number of players: "+ player["NPlayers"])
        .style("left", window.screen.width/3+d3.pointer(mouse)[0]+76 + "px")
        .style("top", d3.pointer(mouse)[1]+200 + "px")
        .style("color", "black");
    })
    .on("mouseout", function () {
      d3.select(this)
      .attr("stroke","green")
      .attr("opacity","0.5")
      .attr("stroke-width", 1.5)

      tooltip.style("opacity", 0).style("left", 0).style("top", 0);
    })
    .on("click", function(event) {
      location.href = "team.html?id="+player["Tm"]
      event.stopPropagation();
    });
  }
  const stats_wrapper = document.getElementById("stats_wrapper");
  console.log(teams_data)
  boxStats(teams_data,stats_wrapper, ["2P","3P","AST","FT","ORB"],["BLK","STL","DRB","PF"],tooltip)

  for (let k=0;k<mins.length;k++){
    const y = d3.scaleLinear()
      .domain([mins[k],maxes[k]])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(3).tickValues([mins[k], maxes[k]]))
      .attr("transform", "translate("+d*k+",0)")
      .attr("class","g-axes")
      .style("color","white");  
  }
}