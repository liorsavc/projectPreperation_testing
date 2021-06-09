const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../../main");



describe("POST /addMatch - Association member user", () => {



    //all
    // beforeAll()
    // request(app).post("/login").send({
    //     username: "admin",
    //     password: "admin"
    // }));
    //all
    // afterAll(
    //     request(app).post("/logout"),
    //     DButils.execQuery(`DELETE FROM dbo.matches WHERE stageName = '10th Stage' AND homeTeam = 'Hapoel Beer Sheva' AND awayTeam = 'Maccabi Tel Aviv'`)

    // );



    test("Acceptance test -  It responds with user that conected to server , open session", async () => {

        const user = request(app).post("/login").send({
            username: "admin",
            password: "admin"
        });
        console.log((await user).statusCode)



        const match = await request(app).post("/league/addMatch").send({
            leagueName: 'SuperLiga',
            seasonName: '2020/2021',
            stageName: '10th Stage',
            homeTeam: 'Hapoel Beer Shevaaa',
            awayTeam: 'Maccabi Tel Avivvv',
            refereeName: 'Anthony Taylor',
            stadium: 'Terner',
            homeScore: 4,
            awayScore: 1,
            date: '2021-08-11',
            time: '21:45',
            lineReferee1: 'Jonathan Moss',
            lineReferee2: 'Stuart Attwell'

        });

        console.log(match.statusCode)
        console.log(match.text)
        let matchdata = await DButils.execQuery(`SELECT * FROM dbo.matches WHERE stageName = '10th Stage' AND homeTeam = 'Hapoel Beer Shevaaa' AND awayTeam = 'Maccabi Tel Avivvv' `);
        console.log(matchdata);
        expect(matchdata.length).toStrictEqual(1);
    });

    // test("Acceptance test - It respons with user that dont exist , wrong details", async () => {
    //     const loginuser = await request(app).post("/login").send({
    //         username: "l",
    //         password: hash_password
    //     });
    //     expect(loginuser.text).toStrictEqual("Username or Password incorrect");
    //     expect(loginuser.status).toBe(401);
    //     // add cookie ?!
    // });

    // test("Acceptance test - It respons with user that dont exist , wrong password", async () => {
    //     const loginuser = await request(app).post("/login").send({
    //         username: "lior1",
    //         password: "lior@12"
    //     });
    //     expect(loginuser.text).toStrictEqual("Username or Password incorrect");
    //     expect(loginuser.status).toBe(401);

    //     // add cookie ?!
    // });
});