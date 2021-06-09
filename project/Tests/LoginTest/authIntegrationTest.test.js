const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses




describe('prepration for testing', () => {
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
       (-1,'lior1','tomer','varon','USA','${hash_password}','lior@lior.com','${profilePic}','${role}');`
        );
    });
    //all
    afterAll(async () => {
        await DButils.execQuery(
            `DELETE FROM dbo.users WHERE user_id = -1`
        );
    });



    test("Integration Test - first check if username exist and after check if password match - Good Pass", async () => {
        const user = await auth_utils.getUser("lior1");
        expect(user).toStrictEqual({
            username: 'lior1',
            firstName: 'tomer',
            lastName: 'varon',
            country: 'USA',
            password: hash_password,
            email: 'lior@lior.com',
            profilePic: 'undefined',
            user_id: -1,
            role: 'undefined'
        })
        let validPass = await auth_utils.checkPasswordHash(hash_password, "lior@123");
        expect(validPass).toBeTruthy();



    })
    test("Integration Test - first check if username exist and after check if password match - Wrong Pass", async () => {
        const user = await auth_utils.getUser("lior1");
        expect(user).toStrictEqual({
            username: 'lior1',
            firstName: 'tomer',
            lastName: 'varon',
            country: 'USA',
            password: hash_password,
            email: 'lior@lior.com',
            profilePic: 'undefined',
            user_id: -1,
            role: 'undefined'
        })
        let validPass = await auth_utils.checkPasswordHash(hash_password, "lior@");
        expect(validPass).not.toBeTruthy();



    })

})