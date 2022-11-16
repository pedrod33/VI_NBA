function autoCompletePlayersName(players) {
  //get Array with Players names and sort
  const playersNames = players.map((p) => p.Player).sort();

  //reference
  let playerInput = document.getElementById("player_input");

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
        const playerLink = document.createElement("a");
        playerLink.href = `./player.html?id=${player}`;
        playerLink.appendChild(match);
        playerLink.appendChild(rest);

        //add link to listItem and add it to the global List
        listItem.appendChild(playerLink);
        const playersList = document.getElementById("players_list");
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