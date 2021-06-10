const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses




describe('prepration for testing', () => {
    let hash_password = bcrypt.hashSync(
        "lior@1234",
        parseInt(process.env.bcrypt_saltRounds)
    );
    let profilePic = "undefined";
    let role = "undefined";
    //all
    beforeAll(async () => {
        await DButils.execQuery(
            `INSERT INTO dbo.users (user_id, username, firstName, lastName, country, password, email, profilePic,role) VALUES
       (-2,'lior122','tomer','varon','USA','${hash_password}','lior@lior.com','${profilePic}','${role}');`
        );
    });
    //all
    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.users WHERE user_id = -2`
        );
    });



    test("Integration Test 1 - login func that uses 2 func(getUser and checkPassword)- valid username and password", async () => {
        const validLogin = await auth_utils.login("lior122", "lior@1234");
        expect(validLogin).toBeTruthy();



    })

    test("Integration Test 2 - login func that uses 2 func(getUser and checkPassword)- valid username and wrong password", async () => {
        const validLogin = await auth_utils.login("lior122", "lior");
        expect(validLogin).toBeFalsy();



    })

    test("Integration Test 3 - login func that uses 2 func(getUser and checkPassword)- wrong username that exist and valid password", async () => {
        const validLogin = await auth_utils.login("lior", "lior@1234");
        expect(validLogin).not.toBeTruthy();



    })

})