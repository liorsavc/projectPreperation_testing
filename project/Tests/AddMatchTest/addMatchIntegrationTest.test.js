const referee_utils = require('../../routes/utils/referee_utils');
const team_utils = require('../../routes/utils/team_utils');
const league_utils = require('../../routes/utils/league_utils');
const matches_utils = require('../../routes/utils/matches_utils');
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const DButils = require("../../routes/utils/DButils");



describe('Match adding usecase Integration Tests, all units are combined under addMatch function...', () => {

    describe('Integration test checking to add game that already exist in system...', () => {

        beforeAll(async () => {

            await DButils.execQuery(
                `INSERT INTO dbo.matches 
                (leagueName,seasonName,stageName,homeTeam,awayTeam,refereeName,stadium,
                    homeScore,awayScore,date,time,id,lineReferee1,lineReferee2) VALUES
                    ('SuperLiga','2020/2021','10th Stage','Hapoel Yerucham','Maccabi Ashdod','Anthony Taylor','Terner',
                    4,1,'2021-09-11','21:45','152','Jonathan Moss','Stuart Attwell')`
            );

        })

        afterAll(async () => {
            await DButils.execQuery(
                `DELETE FROM dbo.matches WHERE id = 152`
            );
        })

        test("Integration Test 1 - addMatch Func - Home team has a game at the same date", async () => {
            try {
                //addMatch(leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium, matchId)
                await league_utils.addMatch('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Yerucham', 'Hapoel Ashdod', '2021-09-11', '21:45', 'Andy Madley', 'Peter Bankes', 'Pual Tierney', 'Ha-Yud-Alef', '152')
                expect(false).toBeFalsy()
            }
            catch (err) {
                expect(err.message).toBe('Hapoel Yerucham has another match at the same date!')
            }

        })

        test("Integration Test 2 - addMatch Func - Away team has a game at the same date", async () => {
            try {
                //addMatch(leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium, matchId)
                await league_utils.addMatch('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Tel Aviv', 'Maccabi Ashdod', '2021-09-11', '21:45', 'Andy Madley', 'Peter Bankes', 'Pual Tierney', 'Vasermile', '152')
                expect(false).toBeFalsy()
            }
            catch (err) {
                expect(err.message).toBe('Maccabi Ashdod has another match at the same date!')
            }

        })


        test("Integration Test 3 - addMatch Func - stadium is busy at the same date", async () => {
            try {
                //addMatch(leagueName, seasonName, stageName, homeTeam, awayTeam, date, time, refereeName, lineReferee1, lineReferee2, stadium, matchId)
                await league_utils.addMatch('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Tel Aviv', 'Maccabi Tal Aviv', '2021-09-11', '21:45', 'Andy Madley', 'Peter Bankes', 'Pual Tierney', 'Terner', '152')
                expect(false).toBeFalsy()
            }
            catch (err) {
                expect(err.message).toBe('Terner already hosts another match at the same date!')
            }
        })
    })

    describe('Integration test checking to add game that dosent exist in system...', () => {
        let rndID;
        beforeAll(async () => {
            rndID = await matches_utils.generateRandId()
        })

        afterAll(async () => {
            DButils.execQuery(
                `DELETE FROM dbo.matches WHERE id = '${rndID}'`
            );
        })

        test('Integration Test 4 - Adding non exisitng game to the DB - should work...', async () => {
            let res = await league_utils.addMatch('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Haifa', 'Baiter Jerusalem', '2021-09-11', '21:45', 'Andy Madley', 'Peter Bankes', 'Pual Tierney', 'Sami Offer', rndID)
            expect(res).toBeTruthy();
            let matchInDB = await DButils.execQuery(`SELECT * FROM dbo.matches WHERE id = '${rndID}'`)
            expect(matchInDB).not.toBeNull();
        })
    })




})



