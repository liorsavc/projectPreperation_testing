const db_utils = require('./DButils');



//this function checks if main referee is free of other matches in the same date.
async function mainRefereeIsFree(refereeName, date) {
    const matches = await db_utils.execQuery(`select * from dbo.matches where refereeName = '${refereeName}' and date = '${date}'; `);
    if (matches.length != 0) {
        //referee is not free 
        return false;
    }
    return true;//len =0 
}

//this function checks if main referee is free of other matches in the same date.
async function lineRefereeIsFree(refereeName, date) {
    const matches = await db_utils.execQuery(`select * from dbo.matches where (lineReferee1 = '${refereeName}' OR lineReferee2 = '${refereeName}') AND date = '${date}'; `);
    if (matches.length != 0) {
        //referee is not free 
        return false;
    }
    return true;//len =0 
}

async function getReferees() {
    const referees = await db_utils.execQuery(`select name from dbo.referees`);
    return referees;
}

exports.lineRefereeIsFree = lineRefereeIsFree;
exports.mainRefereeIsFree = mainRefereeIsFree;
exports.getReferees = getReferees;