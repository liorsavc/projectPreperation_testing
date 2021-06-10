const { test, expect, beforeAll, afterAll } = require("@jest/globals");
const auth_utils = require("../../routes/utils/auth_utils");
const bcrypt = require("bcryptjs");
const DButils = require("../../routes/utils/DButils");
// we will use supertest to test HTTP requests/responses

/// 
describe('Login UseCase Tests : ', () => {
  describe('Unit test - prepration for testing', () => {
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



    test("Unit test - this function gets userName from DB", () => {
      return auth_utils.getUser("lior1").then(data => {
        expect(data).toStrictEqual({
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
      })
    })

    test("Unit test - this function compare passwords from DB", () => {
      return auth_utils.checkPasswordHash(hash_password, "lior@123").then(data => {
        expect(data).toBeTruthy()
      })
    })

    test("Unit test - this function compare passwords from DB", () => {
      return auth_utils.checkPasswordHash(hash_password, "lior@1234").then(data => {
        expect(data).not.toBeTruthy()
      })
    })

    test("Unit test - this function gets userName from DB", () => {
      return auth_utils.getUser("lior").then(data => {
        expect(data).not.toStrictEqual({
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
      })


    })





  });












});





