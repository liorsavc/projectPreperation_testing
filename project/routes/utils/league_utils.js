const axios = require("axios");
const matches_utils = require("./matches_utils");
const referee_utils = require("./referee_utils");
const team_utils = require("./team_utils");
const LEAGUE_ID = 271;

async function getSeason(seasonId) {
  const season = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/seasons/${seasonId}`,
    {
      params: {
        api_token: process.env.api_token,

      },
    }
  );

  return season;
}

async function getStage(stageId) {
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${stageId}`,
    {
      params: {
        api_token: process.env.api_token,

      },
    }
  );
  return stage;
}

// returns data about the league from the API
async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  if (league.data.data.current_stage_id == null) {
    return {
      leagueName: league.data.data.name,
      seasonName: league.data.data.season.data.name,
      stageName: "currently there is no stage available",
      current_season_id: league.data.data.current_season_id,
    };
  }
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    leagueName: league.data.data.name,
    seasonName: league.data.data.season.data.name,
    stageName: stage.data.data.name,
    current_season_id: league.data.data.current_season_id,
  };
}

async function addMatch(leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium, matchId) {
  try {
    //check if given teams has no other matches
    let homeTeamFree = await team_utils.isFreeDate(homeTeam, date);
    if (!homeTeamFree) {
      throw { status: 400, message: homeTeam + " has another match at the same date!" };
    }
    let awayTeamFree = await team_utils.isFreeDate(awayTeam, date);
    if (!awayTeamFree) {
      throw { status: 400, message: awayTeam + " has another match at the same date!" };
    }
    //check that the stadium is free
    let freeStadium = await matches_utils.isFreeStadium(stadium, date);
    if (!freeStadium) {
      throw { status: 400, message: stadium + " already hosts another match at the same date!" };
    }

    //check that chosen referee is availible at the chosen date:
    let allRefsAreFree = await referee_utils.checkAllRefs(refereeName, lineReferee1, lineReferee2, date);
    if (allRefsAreFree) {
      // insert to DB
      matches_utils.addMatchToDB(leagueName, seasonName, stageName, homeTeam, awayTeam, refereeName, lineReferee1, lineReferee2, stadium, date, time, matchId);
      return true;

    }
  }
  catch (err) {
    throw err;
  }

}

exports.addMatch = addMatch;
exports.getLeagueDetails = getLeagueDetails;
exports.getSeason = getSeason;
exports.getStage = getStage;
