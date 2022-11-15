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
      const nrPlayers = data.length;
      const teams = [];
      for (let i = 0; i < nrPlayers; i++) {
        if (!teams.includes(data[i].Tm)) teams.push(data[i].Tm);
      }

      console.log("nrPlayers", data.length);
      console.log("teams", teams);
      console.log("nrTeams", teams.length);

      //how to get information from dataset
      console.log(data[0]["Player"]);

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
