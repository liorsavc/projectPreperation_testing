
const referee_utils = require('../../routes/utils/referee_utils');
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const DButils = require("../../routes/utils/DButils");

describe(`Integration test to assigning referee into a match`, () => {
    beforeAll(async () => {
        await DButils.execQuery(
            `INSERT INTO dbo.matches 
            (leagueName,seasonName,stageName,homeTeam,awayTeam,refereeName,stadium,
                homeScore,awayScore,date,time,id,lineReferee1,lineReferee2) VALUES
                ('SuperLiga','2020/2021','10th Stage','Hapoel Beer Sheva','Maccabi Tel Aviv,','Mike Dean','Terner',
                4,1,'2021-09-10','21:45','669','David Coote','Peter Bankes')`
        );
    })

    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.matches WHERE id = 669`
        );
    })

    test('Testing if all 3 referees are free on the 2021-08-10 - Non is Free...', async () => {
        try {
            await referee_utils.checkAllRefs('Mike Dean', 'David Coote', 'Peter Bankes', '2021-09-10');
            expect(true).toBeFalsy()
        }
        catch (err) {
            expect(err.message).toBe(`Mike Dean already embedded to another match at the same date!`)
        }
    })

    test('Testing if all 3 referees are free on the 2021-08-10 - David is not free...', async () => {
        try {
            await referee_utils.checkAllRefs('Michael Oliver', 'David Coote', 'Peter Bankes', '2021-09-10');
            expect(true).toBeFalsy()
        }
        catch (err) {
            expect(err.message).toBe(`David Coote already embedded to another match at the same date!`)
        }
    })

    test('Testing if all 3 referees are free on the 2021-08-10 - Peter Bankes is not free...', async () => {
        try {
            await referee_utils.checkAllRefs('Michael Oliver', 'Craig Pawson', 'Peter Bankes', '2021-09-10');
            expect(true).toBeFalsy()
        }
        catch (err) {
            expect(err.message).toBe(`Peter Bankes already embedded to another match at the same date!`)
        }
    })

    test('Testing if all 3 referees are free on the 2021-08-10 - All are Free...', async () => {
        let res = await referee_utils.checkAllRefs('Mike Dean', 'David Coote', 'Peter Bankes', '2021-09-20');
        expect(res).toBeTruthy()
    })
})