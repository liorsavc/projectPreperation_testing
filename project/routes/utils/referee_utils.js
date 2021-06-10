const db_utils = require('./DButils');
// const { getNextMatch } = require('./matches_utils');



//this function checks if main referee is free of other matches in the same date.
async function mainRefereeIsFree(refereeName, date) {
    const matches = await db_utils.execQuery(`select * from dbo.matches where refereeName = '${refereeName}' and date = '${date}'; `);
    if (matches.length != 0) {
        // console.log("ref is: " + refereeName + " date: " + date);
        //referee is not free 
        return false;
    }
    return true;//len =0 
}

//this function checks if main referee is free of other matches in the same date.
async function lineRefereeIsFree(refereeName, date) {
    const matches = await db_utils.execQuery(`select * from dbo.matches where (lineReferee1 = '${refereeName}' OR lineReferee2 = '${refereeName}') AND date = '${date}'; `);
    if (matches.length != 0) {
        // console.log("ref is: " + refereeName + " date: " + date);
        //referee is not free 
        return false;
    }
    return true;//len =0 
}

async function getMainReferees() {
    const referees = await db_utils.execQuery(`select name from dbo.referees where role='main'`);
    return referees;
}


async function getLineReferees() {
    const referees = await db_utils.execQuery(`select name from dbo.referees where role='line'`);
    return referees;
}


async function checkAllRefs(refereeName, lineReferee1, lineReferee2, date) {
    let mainRefIsFree = await mainRefereeIsFree(refereeName, date);
    if (!mainRefIsFree) {
        throw { status: 400, message: refereeName + " already embedded to another match at the same date!" };
    }
    let lineReferee1IsFree = await lineRefereeIsFree(lineReferee1, date);
    if (!lineReferee1IsFree) {
        throw { status: 400, message: lineReferee1 + " already embedded to another match at the same date!" };
    }
    let lineReferee2IsFree = await lineRefereeIsFree(lineReferee2, date);
    if (!lineReferee2IsFree) {
        throw { status: 400, message: lineReferee2 + " already embedded to another match at the same date!" };
    }
    return true;
}

exports.lineRefereeIsFree = lineRefereeIsFree;
exports.mainRefereeIsFree = mainRefereeIsFree;
exports.getMainReferees = getMainReferees;
exports.getLineReferees = getLineReferees;
exports.checkAllRefs = checkAllRefs;