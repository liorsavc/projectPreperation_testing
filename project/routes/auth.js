var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const { select } = require("async");
const MAX_USERS_IN_SYS = 25000;
const auth_utils = require("./utils/auth_utils");
router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
      "SELECT username FROM dbo.users"
    );


    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };


    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let country = req.body.country;
    let email = req.body.email;
    let profilePic = req.body.profilePic;
    let role = req.body.role;
    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;
    //generate random user_id
    let random_user_id = Math.floor(Math.random() * MAX_USERS_IN_SYS);
    let userId = await DButils.execQuery(
      `select user_id from dbo.users where user_id = '${random_user_id}'`
    );
    while (userId.length !== 0) {
      random_user_id = Math.floor(Math.random() * maxUsersInSys);
      userId = await DButils.execQuery(
        `select user_id from dbo.users where user_id = '${random_user_id}'`
      );
    }
    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (user_id, username, firstName, lastName, country, password, email, profilePic,role) VALUES
       ('${random_user_id}','${req.body.username}','${firstName}','${lastName}','${country}', '${hash_password}','${email}','${profilePic}','${role}');`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {

    let validLogin = await auth_utils.login(req.body.username, req.body.password);
    if (!validLogin) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    let user = await auth_utils.getUser(req.body.username);



    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  // if (!(req.session && req.session.id)) res.status(401).send('unauthorized'); //try to logout when not loged in
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  // might need to delete local sotrage cache
  res.status(200).send({ success: true, message: "logout succeeded" });
});


module.exports = router;