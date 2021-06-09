const referee_utils = require('../../routes/utils/referee_utils');
const team_utils = require('../../routes/utils/team_utils');
const matches_utils = require('../../routes/utils/matches_utils');
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const DButils = require("../../routes/utils/DButils");



describe('Match adding usecase Integration Tests...', () => {
    let homeTeam = 'Hapoel Beer ShevaB';


    // beforeAll(async () => {

    //     // await DButils.execQuery(
    //     //     `INSERT INTO dbo.matches 
    //     //     (leagueName,seasonName,stageName,homeTeam,awayTeam,refereeName,stadium,
    //     //         homeScore,awayScore,date,time,id,lineReferee1,lineReferee2) VALUES
    //     //         ('SuperLiga','2020/2021','10th Stage','Hapoel Beer ShevaB','Maccabi Tel AvivB,','Anthony Taylor','Terner',
    //     //         4,1,'2021-08-11','21:45','667','Jonathan Moss','Stuart Attwell')`
    //     // );

    // })

    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.matches WHERE id = -3`
        );
    })

    test("Integration Test 1 - all stubs designed to pass the test - addMatchToDB Func", async () => {



        //get data from body

        //check if given teams has no other matches
        if (false) {
            throw { status: 400, message: homeTeam + " has another match at the same date!" };
        }
        if (false) {
            throw { status: 400, message: awayTeam + " has another match at the same date!" };
        }
        //check that the stadium is free
        if (false) {
            throw { status: 400, message: stadium + " already hosts another match at the same date!" };
        }

        //check that chosen referee is availible at the chosen date:
        if (false) {
            throw { status: 400, message: refereeName + " already embedded to another match at the same date!" };
        }

        if (false) {
            throw { status: 400, message: lineReferee1 + " already embedded to another match at the same date!" };
        }
        if (false) {
            throw { status: 400, message: lineReferee2 + " already embedded to another match at the same date!" };
        }

        // insert to DB

        matches_utils.addMatchToDB('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Beer ShevaB', 'Maccabi Tel AvivB,', 'Anthony Taylor', 'Terner',
            4, 1, '2021-08-11', '21:45', '-3', 'Jonathan Moss', 'Stuart Attwell');

        let match = await DButils.execQuery(`SELECT id from dbo.matches where id = -3 `);
        console.log(match)
        expect(match[0].id).toStrictEqual(-3);



    })

    // test("Integration Test 2 - homeTeam has Another match  - addMatchToDB Func Fail", () => {
    //     expect(async () => {
    //         try {
    //             if (true) {
    //                 throw { status: 400, message: homeTeam + " has another match at the same date!" };
    //             }
    //             if (false) {
    //                 throw { status: 400, message: awayTeam + " has another match at the same date!" };
    //             }
    //             //check that the stadium is free
    //             if (false) {
    //                 throw { status: 400, message: stadium + " already hosts another match at the same date!" };
    //             }

    //             //check that chosen referee is availible at the chosen date:
    //             if (false) {
    //                 throw { status: 400, message: refereeName + " already embedded to another match at the same date!" };
    //             }

    //             if (false) {
    //                 throw { status: 400, message: lineReferee1 + " already embedded to another match at the same date!" };
    //             }
    //             if (false) {
    //                 throw { status: 400, message: lineReferee2 + " already embedded to another match at the same date!" };
    //             }

    //             // insert to DB

    //             matches_utils.addMatchToDB('SuperLiga', '2020/2021', '10th Stage', 'Hapoel Beer ShevaB', 'Maccabi Tel AvivB,', 'Anthony Taylor', 'Terner',
    //                 4, 1, '2021-08-11', '21:45', '-3', 'Jonathan Moss', 'Stuart Attwell');

    //             let match = await DButils.execQuery(`SELECT id from dbo.matches where id = -3 `);
    //             console.log(match)
    //         }
    //         catch (err) {
    //             return err;
    //         }


    //     }).toThrow();
    // })




})