//function that is called on the load of the body, and receives the current page
async function main(page) {
  //Menu appears in all pages, so we render it, and pass the current page, so it know which tab is active
  renderMenu(page);

  //load datest
  const data = await d3.dsv(
    ";",
    ".././data/2022-2023_NBA_Player_Stats.csv",
    (d) => {
      return d;
    }
  );

  //switch with all pages
  switch (page) {
    case "home":
      addNrPlayers(data);
      addNrTeams(data);

      break;

    case "players":
      //LOGIC TODO: inside players page dinamycally
      console.log("players");
      break;

    case "teams":
      //LOGIC TODO: inside teams page dinamycally
      console.log("teams");
      break;

    default:
      break;
  }
}
