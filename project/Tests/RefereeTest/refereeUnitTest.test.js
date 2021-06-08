const referee_utils = require('../../routes/utils/referee_utils');
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const DButils = require("../../routes/utils/DButils");



describe('Referees assigning usecase unit tests...', () => {
    //first testing the getters of the referees (lineman and mainref)
    describe('Testing getMainReferees and getLineReferees..', () => {
        let numOfLineRefAfterAdd = 8;
        let numOfMainRefAfterAdd = 7;

        beforeAll(async () => {
            await DButils.execQuery(
                `INSERT INTO dbo.referees (id,name,role) VALUES
            (14,'TestMainRef','main')`
            );
            await DButils.execQuery(
                `INSERT INTO dbo.referees (id,name,role) VALUES
            (15,'TestLineRef','line')`
            );

        });

        afterAll(async () => {
            await DButils.execQuery(
                `DELETE FROM dbo.referees WHERE id = 14 `
            );

            await DButils.execQuery(
                `DELETE FROM dbo.referees WHERE id = 15 `
            );
        });


        test('Testing lineReferees getter', () => {
            return referee_utils.getLineReferees().then(data => {
                expect(data.length).toBe(numOfLineRefAfterAdd)
            })
        })

        test('Testing mainReferees getter', () => {
            return referee_utils.getMainReferees().then(data => {
                expect(data.length).toBe(numOfMainRefAfterAdd)
            })
        })


    });

    // Unit test to check the referess are free on X date:
    describe('Testing free Referees... ', () => {
        // adding game with Anthony Taylor as main ref, Jonathan Moss and Stuart Attwell as line refs
        beforeAll(async () => {
            await DButils.execQuery(
                `INSERT INTO dbo.matches 
                (leagueName,seasonName,stageName,homeTeam,awayTeam,refereeName,stadium,
                    homeScore,awayScore,date,time,id,lineReferee1,lineReferee2) VALUES
                    ('SuperLiga','2020/2021','10th Stage','Hapoel Beer Sheva','Maccabi Tel Aviv,','Anthony Taylor','Terner',
                    4,1,'2021-08-10','21:45','666','Jonathan Moss','Stuart Attwell')`
            );
        })

        afterAll(async () => {
            await DButils.execQuery(
                `DELETE FROM dbo.matches WHERE id = 666`
            );
        })

        test('Testing if Anthony Taylor is free on the 2021-08-10...', () => {
            return referee_utils.mainRefereeIsFree('Anthony Taylor', '2021-08-10').then(data => {
                expect(data).toBeFalsy()
            })
        }, 30000)

        test('Testing if Anthony Taylor is free on the 2021-08-11...', () => {
            return referee_utils.mainRefereeIsFree('Anthony Taylor', '2021-08-11').then(data => {
                expect(data).toBeTruthy()
            })
        }, 30000)

        test('Testing if Michael Oliver is free on the 2021-08-10...', () => {
            return referee_utils.mainRefereeIsFree('Michael Oliver', '2021-08-10').then(data => {
                expect(data).toBeTruthy()
            })
        }, 30000)

        // Jonathan Moss and Stuart Attwell have a match on the 2021-08-10
        test('Testing if Jonathan Moss is free on the 2021-08-10...', () => {
            return referee_utils.lineRefereeIsFree('Jonathan Moss', '2021-08-10').then(data => {
                expect(data).toBeFalsy()
            })
        }, 30000)

        test('Testing if Jonathan Moss is free on the 2021-08-10...', () => {
            return referee_utils.lineRefereeIsFree('Stuart Attwell', '2021-08-10').then(data => {
                expect(data).toBeFalsy()
            })
        }, 30000)
        //Craig Pawson is not scheduled for any game at the 2021-08-10
        test('Testing if Craig Pawson is free on the 2021-08-10...', () => {
            return referee_utils.lineRefereeIsFree('Craig Pawson', '2021-08-10').then(data => {
                expect(data).toBeTruthy()
            })
        }, 30000)

        // Jonathan Moss and Stuart Attwell dont have a match on the 2021-08-11
        test('Testing if Jonathan Moss is free on the 2021-08-11...', () => {
            return referee_utils.lineRefereeIsFree('Jonathan Moss', '2021-08-11').then(data => {
                expect(data).toBeTruthy()
            })
        }, 30000)

        test('Testing if Jonathan Moss is free on the 2021-08-11...', () => {
            return referee_utils.lineRefereeIsFree('Stuart Attwell', '2021-08-11').then(data => {
                expect(data).toBeTruthy()
            })
        }, 30000)



    });

});