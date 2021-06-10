
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../main");




describe("POST /login ", () => {
    let hash_password = bcrypt.hashSync(
        "lior@123",
        parseInt(process.env.bcrypt_saltRounds)
    );
    let profilePic = "undefined";
    let role = "undefined";
    //all
    beforeAll(async () => {
        await DButils.execQuery(
            `INSERT INTO dbo.users (user_id, username, firstName, lastName, country, password, email, profilePic,role) VALUES
       (-3,'lior13','tomer','varon','USA','${hash_password}','lior@lior.com','${profilePic}','${role}');`
        );
    });
    //all
    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.users WHERE user_id = -3`
        );
    });



    test("Acceptance test -  It responds with user that conected to server , open session", async () => {
        const loginuser = await request(app).post("/login").send({
            username: "lior13",
            password: "lior@123"
        });
        expect(loginuser.text).toStrictEqual("login succeeded");
        expect(loginuser.status).toBe(200);
        expect(loginuser.headers).toHaveProperty(['set-cookie']);
        // add cookie ?!
    });

    test("Acceptance test - It respons with user that dont exist , wrong details", async () => {
        const loginuser = await request(app).post("/login").send({
            username: "l",
            password: "lior@"
        });
        expect(loginuser.text).toStrictEqual("Username or Password incorrect");
        expect(loginuser.status).toBe(401);
        // add cookie ?!
    });

    test("Acceptance test - It respons with user that dont exist , wrong password", async () => {
        const loginuser = await request(app).post("/login").send({
            username: "lior13",
            password: "lior@12345"
        });
        expect(loginuser.text).toStrictEqual("Username or Password incorrect");
        expect(loginuser.status).toBe(401);

        // add cookie ?!
    });
});



describe("POST /addMatch with asso member that loged in!!!", () => {
    let cookie;
    beforeAll(async () => {
        const loginuser = await request(app).post("/login").send({
            username: "admin",
            password: "admin"
        });
        cookie = loginuser.header["set-cookie"][0];

    });
    afterAll(async () => {
        DButils.execQuery(`DELETE FROM dbo.matches WHERE homeTeam ='Hapoel Yerucham' AND
        awayTeam = 'Maccabi Ashdod';`);
    });



    test("Acceptance test -  its succssesful add", async () => {

        // const loginuser = await request(app).post("/login").send({
        //     username: "admin",
        //     password: "admin"
        // });
        // let cookie = loginuser.header["set-cookie"][0];
        console.log("coooooookie")
        console.log(cookie);

        let match = await request(app).post("/league/addMatch").send({
            leagueName: 'SuperLiga',
            seasonName: '2020/2021',
            stageName: '10th Stage',
            homeTeam: 'Hapoel Yerucham',
            awayTeam: 'Maccabi Ashdod',
            date: '2021-09-12',
            time: '21:45',
            refereeName: 'Anthony Taylor',
            lineReferee1: 'Jonathan Moss',
            lineReferee2: 'Stuart Attwell',
            stadium: 'Terner'

        }).set('cookie', cookie);

        // expect(match.text).toStrictEqual("login succeeded");
        expect(match.status).toBe(201);
        // expect(loginuser.headers).toHaveProperty(['set-cookie']);
        // add cookie ?!
    }, 30000)


    test("Acceptance test - fail add , stadium already taken in this date", async () => {


        let match = await request(app).post("/league/addMatch").send({
            leagueName: 'SuperLiga',
            seasonName: '2020/2021',
            stageName: '10th Stage',
            homeTeam: 'Hapoel Yerucham15',
            awayTeam: 'Maccabi Ashdod15',
            date: '2021-09-12',
            time: '21:45',
            refereeName: 'Anthony Taylor15',
            lineReferee1: 'Jonathan Moss15',
            lineReferee2: 'Stuart Attwell15',
            stadium: 'Terner'

        }).set('cookie', cookie);

        // expect(match.text).toStrictEqual("login succeeded");
        expect(match.status).toBe(400);
        // expect(loginuser.headers).toHaveProperty(['set-cookie']);
        // add cookie ?!
    }, 30000)


    test("Acceptance test - fail add , main Ref already assigned in this date", async () => {


        let match = await request(app).post("/league/addMatch").send({
            leagueName: 'SuperLiga',
            seasonName: '2020/2021',
            stageName: '10th Stage',
            homeTeam: 'Hapoel Yerucham15',
            awayTeam: 'Maccabi Ashdod15',
            date: '2021-09-12',
            time: '21:45',
            refereeName: 'Anthony Taylor',
            lineReferee1: 'Jonathan Moss15',
            lineReferee2: 'Stuart Attwell15',
            stadium: 'Terner15'

        }).set('cookie', cookie);

        // expect(match.text).toStrictEqual("login succeeded");
        expect(match.status).toBe(400);
        // expect(loginuser.headers).toHaveProperty(['set-cookie']);
        // add cookie ?!
    }, 30000)
});




describe("POST /addMatch asso member noto loged in ", () => {
    let cookie;
    beforeAll(async () => {
        const loginuser = await request(app).post("/login").send({
            username: "player",
            password: "player"
        });
        cookie = loginuser.header["set-cookie"][0];

    });




    test("Acceptance test -  fail to add match , not asso member", async () => {




        let match = await request(app).post("/league/addMatch").send({
            leagueName: 'SuperLiga',
            seasonName: '2020/2021',
            stageName: '10th Stage',
            homeTeam: 'Hapoel Yerucham',
            awayTeam: 'Maccabi Ashdod',
            date: '2021-09-12',
            time: '21:45',
            refereeName: 'Anthony Taylor',
            lineReferee1: 'Jonathan Moss',
            lineReferee2: 'Stuart Attwell',
            stadium: 'Terner'

        }).set('cookie', cookie);

        // expect(match.text).toStrictEqual("login succeeded");
        expect(match.status).toBe(403);
        console.log(match.text);
        // expect(loginuser.headers).toHaveProperty(['set-cookie']);
        // add cookie ?!
    }, 30000)


});