
const DButils = require("./DButils");
const bcrypt = require("bcryptjs");



async function getUser(userName){

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

  

  async function checkPasswordHash(DBPassword,loginPassword){

    if(!bcrypt.compareSync(loginPassword, DBPassword)){
        return false;
    }
    return true;
  }

  exports.getUser = getUser;
  exports.checkPasswordHash = checkPasswordHash;