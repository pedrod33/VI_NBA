const teams = {
  TOR: {
    name: "Toronto Raptors",
    image: "/images/Raptors.png",
  },
  MEM: {
    name: "Memphis Grizzlies",
    image: "/images/Grizzlies.png",
  },
  MIA: {
    name: "Miami Heat",
    image: "/images/Heat.png",
  },
  UTA: {
    name: "Utah Jazz",
    image: "/images/Jazz.png",
  },
  MIL: {
    name: "Milwaukee Bucks",
    image: "/images/Bucks.png",
  },
  CLE: {
    name: "Cleveland Cavaliers",
    image: "/images/Cavaliers.png",
  },
  MIN: {
    name: "Minnesota Timberwolves",
    image: "/images/Timberwolves.png",
  },
  NOP: {
    name: "New Orleans Pelicans",
    image: "/images/Pelicans.png",
  },
  WAS: {
    name: "Washington Wizards",
    image: "/images/Wizards.png",
  },
  ORL: {
    name: "Orlando Magic",
    image: "/images/Magic.png",
  },
  NYK: {
    name: "New York Knicks",
    image: "/images/Knicks.png",
  },
  PHO: {
    name: "Phoenix Suns",
    image: "/images/Suns.png",
  },
  GSW: {
    name: "Golden State Warriors",
    image: "/images/Warriors.png",
  },
  SAS: {
    name: "San Antonio Spurs",
    image: "/images/Spurs.png",
  },
  SAC: {
    name: "Sacramento Kings",
    image: "/images/Kings.png",
  },
  LAC: {
    name: "Los Angeles Clippers",
    image: "/images/Clippers.png",
  },
  OKC: {
    name: "Oklahoma City Thunder",
    image: "/images/Thunder.png",
  },
  LAL: {
    name: "Los Angeles Lakers",
    image: "/images/Lakers.png",
  },
  DET: {
    name: "Detroit Pistons",
    image: "/images/Pistons.png",
  },
  IND: {
    name: "Indiana Pacers",
    image: "/images/Pacers.png",
  },
  CHO: {
    name: "Charlotte Hornets",
    image: "/images/Hornets.png",
  },
  CHI: {
    name: "Chicago Bulls",
    image: "/images/Bulls.png",
  },
  DEN: {
    name: "Denver Nuggets",
    image: "/images/Nuggets.png",
  },
  BOS: {
    name: "Boston Celtics",
    image: "/images/Celtics.png",
  },
  POR: {
    name: "Portland Trail Blazers",
    image: "/images/Blazers.png",
  },
  DAL: {
    name: "Dallas Mavericks",
    image: "/images/Mavericks.png",
  },
  ATL: {
    name: "Atlanta Hawks",
    image: "/images/Hawks.png",
  },
  HOU: {
    name: "Houston Rockets",
    image: "/images/Rockets.png",
  },
  BRK: {
    name: "Brooklyn Nets",
    image: "/images/Nets.png",
  },
  PHI: {
    name: "Philadelphia 76ers",
    image: "/images/76ers.png",
  },
};

function getTeam(teamInitials) {
  return teams[teamInitials];
}

function getAllTeamsNames() {
  const allTeamsNames = Object.keys(teams).map((abb) => teams[abb].name);
  return allTeamsNames;
}
