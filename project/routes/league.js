var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const referee_utils = require("./utils/referee_utils");
const matches_utils = require("./utils/matches_utils");
const team_utils = require("./utils/team_utils"); //// 
const DB_utils = require("./utils/DButils");
/**
 * Authenticate all incoming requests by middleware
 */
router.get("/getDetails", async (req, res, next) => {
  try {
    let league_details = await league_utils.getLeagueDetails();
    let next_match = matches_utils.getNextMatch();
    league_details.nextMatch = next_match;
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DB_utils.execQuery("SELECT user_id FROM dbo.users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

router.use(async function (req, res, next) {
  const user_id = req.session.user_id;
  const role = await DB_utils.execQuery(`SELECT role FROM dbo.users where user_id ='${user_id}';`)
  if (role[0].role == "asso_member") {
    next();
  }
  else {
    res.status(403).send("only association member can add new matches to the system!");
  }
});



// add new match to DB by association member
router.post("/addMatch", async (req, res, next) => {
  //check if logged user is association member role
  //get data from body
  const { leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium } = req.body;
  const matchId = await matches_utils.generateRandId();

  try {
    let addMatchResult = await league_utils.addMatch(leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium, matchId);
    if (addMatchResult) {
      res.status(201).send("match added successfully");
    }
  }
  catch (err) {
    next(err);
  }

});

router.post("/updateMatchScore", async (req, res, next) => {
  //check if logged user is association member role
  try {

    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const role = await DB_utils.execQuery(`SELECT role FROM dbo.users where user_id ='${user_id}';`)
      if (role[0].role != "asso_member")
        throw { status: 403, message: "only association member can update matches score!" };

    }

    //get data from body
    const homeTeamScore = req.body.homeTeamScore;
    const awayTeamScore = req.body.awayTeamScore;
    const matchId = req.body.matchId;


    // insert to DB
    await DB_utils.execQuery(
      `UPDATE dbo.matches
      SET homeScore = '${homeTeamScore}', awayScore = '${awayTeamScore}'
      WHERE id='${matchId}';`
    );

    res.status(201).send("match score updated successfully");
  } catch (error) {
    next(error);
  }
});


module.exports = router;
