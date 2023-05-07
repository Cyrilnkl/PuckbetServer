const connection = require('../utils/puckbet_db')

function getAllParis(){
    console.log("========")
    connection.query("SELECT * FROM paris", function (err, result, fields) {
        console.log(result);
    });
}

function getAllMatch(){
    console.log("======== MATCH")
    connection.query("SELECT * FROM MATCHS ORDER BY DATE_START DESC LIMIT 10;", function (err, result, fields) {
        console.log(result);
    });
}


module.exports = { getAllParis, getAllMatch };