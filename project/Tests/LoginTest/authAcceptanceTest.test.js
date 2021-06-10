
const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../../main");




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