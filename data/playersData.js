function getPlayerStats(player, allPlayers) {
  // To convert from 3ps% to
  // outsideScoring rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const threePts = allPlayers.map((p) => +p["3P%"]);
  const threePtsAverage = threePts.reduce((a, b) => a + b, 0) / threePts.length;
  const outsideScoring =
    normalize(+player["3P%"], threePts, threePtsAverage / 2) * 100;

  // To convert from 2ps% to
  // insideScoring rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const twoPts = allPlayers.map((p) => +p["2P%"]);
  const twoPtsAverage = twoPts.reduce((a, b) => a + b, 0) / twoPts.length;
  const insideScoring =
    normalize(+player["2P%"], twoPts, twoPtsAverage / 2) * 100;

  // To convert from ft% to
  // freeThrow rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const freeThrows = allPlayers.map((p) => +p["FT%"]);
  console.log("freeThrows", freeThrows);
  const freeThrowAverage =
    freeThrows.reduce((a, b) => a + b, 0) / freeThrows.length;
  console.log("freeThrowsAverage", freeThrowAverage);
  console.log("freeThrow", player["FT%"]);
  const freeThrow =
    normalize(+player["FT%"], freeThrows, freeThrowAverage / 4) * 100;

  // To convert from number of assists per game to
  // Playmaking rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const assists = allPlayers.map((p) => +p.AST);
  const assistsAverage = assists.reduce((a, b) => a + b, 0) / assists.length;
  const playmaking = normalize(+player.AST, assists, assistsAverage / 2) * 100;

  // To convert from number of rebounds per game (offensive + defensive) to
  // rebounding rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const rebounds = allPlayers.map((p) => +p.ORB + +p.DRB);
  const reboundsAverage = rebounds.reduce((a, b) => a + b, 0) / rebounds.length;
  const playerRebounding = +player.ORB + +player.DRB;
  const rebounding =
    normalize(playerRebounding, rebounds, reboundsAverage / 2) * 100;

  // To convert from number of steals and blocks per game to
  // Defending rating (0-100),
  // We do an optimistic normalization that subtracts the average to the max, so the values are generally higher
  const defenseStats = allPlayers.map((p) => +p.STL + +p.BLK);
  const defenseStatsAverage =
    defenseStats.reduce((a, b) => a + b, 0) / defenseStats.length;
  const playerDefensiveStates = +player.STL + +player.BLK;
  const defending =
    normalize(playerDefensiveStates, defenseStats, defenseStatsAverage / 2) *
    100;

  const stats = {
    outsideScoring: round(outsideScoring, 0),
    insideScoring: round(insideScoring, 0),
    freeThrow: round(freeThrow, 0),
    playmaking: round(playmaking, 0),
    rebounding: round(rebounding, 0),
    defending: round(defending, 0),
  };

  function normalize(val, allVal, extraMax = 0) {
    //extraMax is to make the normalization get higher values to ignore values to close to 0
    const min = Math.min(...allVal);
    let max = Math.max(...allVal) - extraMax;

    //Since we are adding an extra, it can turn it to less than 0, so we have to have a fallback
    if (max - min <= 0) max = Math.max(...allVal);

    let normalizedVal = (val - min) / (max - min);

    //Since we are adding an extra, it can turn it to greater than 1, so we have to have a fallback
    if (normalizedVal > 1) normalizedVal = 1;

    return normalizedVal;
  }

  function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  return stats;
}
