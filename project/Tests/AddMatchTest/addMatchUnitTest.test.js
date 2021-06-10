const referee_utils = require('../../routes/utils/referee_utils');
const team_utils = require('../../routes/utils/team_utils');
const matches_utils = require('../../routes/utils/matches_utils');
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const DButils = require("../../routes/utils/DButils");

describe('Match adding usecase unit tests...', () => {
    beforeAll(async () => {
        await DButils.execQuery(
            `INSERT INTO dbo.matches 
            (leagueName,seasonName,stageName,homeTeam,awayTeam,refereeName,stadium,
                homeScore,awayScore,date,time,id,lineReferee1,lineReferee2) VALUES
                ('SuperLiga','2020/2021','10th Stage','Hapoel Beer Sheva','Maccabi Tel Aviv,','Anthony Taylor','Terner',
                4,1,'2021-08-11','21:45','666','Jonathan Moss','Stuart Attwell')`
        );
    })

    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.matches WHERE id = 666`
        );
    })

    //isFreeStadium(stadium, date)

    test('Testing if Terner is used on the 2021-08-11...', () => {
        return matches_utils.isFreeStadium('Terner', '2021-08-11').then(data => {
            expect(data).toBeFalsy()
        })
    })

    test('Testing if Allianz Arena is used on the 2021-08-11...', () => {
        return matches_utils.isFreeStadium('Allianz Arena', '2021-08-11').then(data => {
            expect(data).toBeTruthy()
        })
    })

    // checks if team is available in the given date. we assume that team can not play more than 1 match a day.
    //async function isFreeDate(teamName, date)
    test('Testing if Hapoel Beer Sheva can assiged into a game at 2021-08-11', () => {
        return team_utils.isFreeDate('Hapoel Beer Sheva', '2021-08-11').then(data => {
            expect(data).toBeFalsy()
        })
    })

    test('Testing if Horsens can assiged into a game at 2021-08-11', () => {
        return team_utils.isFreeDate('Horsens', '2021-08-11').then(data => {
            expect(data).toBeTruthy()
        })
    })

    //testing matches_utils.generateRandId() - should return number to be assign to a match that dose not exist in matches DB 
    test('Testing the auto generation match id', async () => {
        let rndNumber = await matches_utils.generateRandId();
        let isInDB = false;
        //check that there is no match with the same ID in matches DB
        let matchesWithRndNumber = await DButils.execQuery(`SELECT id FROM dbo.matches WHERE id = '${rndNumber}'`)
        let numOfMatches = matchesWithRndNumber.length;
        expect(numOfMatches).toBe(0);
    })

});



