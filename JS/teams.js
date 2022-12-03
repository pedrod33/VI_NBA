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

function teamsStats(data){
  const parent_div = document.getElementById("teams_content");
  const dings = ["Age","PTS", "BLK", "AST", "TOV", "TRB"]
  const team_list = document.getElementById("teams_list");
  if(team_list){
    team_list.remove();
  }
  const filters = document.createElement("div")
  filters.id = "filters_div";
  filters.style.width = "40%"
  filters.style.display = "inline-block";
  parent_div.appendChild(filters)
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
  select.style.marginLeft = "10px"
  //select.innerHTML ="<br>"
  
  const from_field = document.createElement("input");
  from_field.placeholder = "From";
  from_field.id = "from_field";
  from_field.style.maxWidth = "70px";
  const to_field = document.createElement("input");
  to_field.placeholder = "To";
  to_field.id = "to_field";
  to_field.style.maxWidth = "70px";
  to_field.style.marginLeft = "10px"
  filters.appendChild(text)
  filters.appendChild(select)
  filters.appendChild(document.createElement("br"));
  filters.appendChild(from_field)
  filters.appendChild(to_field)

  const line_graph_div = document.createElement("div");
    line_graph_div.style.width = "50%";
    line_graph_div.style.height = "50%";
    line_graph_div.style.display = "inline-block";
    line_graph_div.id = "team_line_graph_id"
    
    parent_div.appendChild(line_graph_div);
    const player_tooltip = d3
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
    

    let [team_total_data,  avg_per_player_data]= teamData(data);
    console.log(team_total_data);
    console.log(avg_per_player_data);

    let statKeys = ["Age","G","MP","2P", "3P", "AST","BLK","FG","FT","STL","TOV","TRB"]
    drawLineGraph(team_total_data, statKeys, line_graph_div, player_tooltip, "Team Stats");

}
