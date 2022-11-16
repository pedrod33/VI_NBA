function addTeams(data) {
  //get all Teams going trough all players
  const teams = [];
  for (let i = 0; i < data.length; i++) {
    if (!teams.includes(data[i].Tm)) teams.push(data[i].Tm);
  }

  //add teams
  filterTeams(teams.sort(), "");

  //reference
  let teamInput = document.getElementById("team_input");

  //Execute function on keyup to filter teams
  teamInput.addEventListener("keyup", () => {
    removeElements();
    filterTeams(teams.sort(), teamInput.value);
  });

  function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".tlist-item");
    items.forEach((item) => {
      item.remove();
    });
  }
}

function filterTeams(teams, filter) {
  //create all teams cards
  for (let team of teams) {
    const teamInfo = getTeam(team);
    if (
      teamInfo.name.toLowerCase().startsWith(filter.toLowerCase()) ||
      filter === ""
    ) {
      //create li element
      const listItem = document.createElement("li");
      listItem.classList.add("tlist-item");

      //Create img element of team
      const teamImg = document.createElement("img");
      teamImg.src = teamInfo.image;
      teamImg.alt = `Logo of team ${teamInfo.name}`;

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
      const teamsList = document.getElementById("teams_list");
      teamsList.appendChild(listItem);
    }
  }
}
