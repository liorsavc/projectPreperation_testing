
const DButils = require("./DButils");
const bcrypt = require("bcryptjs");



async function getUser(userName) {

  const user = (
    await DButils.execQuery(
      `SELECT * FROM dbo.users WHERE username = '${userName}'`
    )
  )[0];
  return user;
  // if(!user){
  //     return false;
  // }
  // return true;

}



async function checkPasswordHash(DBPassword, loginPassword) {

  if (!bcrypt.compareSync(loginPassword, DBPassword)) {
    return false;
  }
  return true;
}


async function login(username, password) {
  // check if username exist 
  let user = await getUser(username);
  // user = user[0];
  if (!user) {
    return false;
  }

  // check that username exists & the password is correct

  let passwordCheck = await checkPasswordHash(user.password, password)
  if (!passwordCheck) {
    return false;
  }
  else { return true; }

}

exports.getUser = getUser;
exports.checkPasswordHash = checkPasswordHash;
exports.login = login;