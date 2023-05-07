const connection = require('../utils/puckbet_db')

function newBetInsert(name, body, callback) {
    //console.log("===",body)
    const queryBet = 'INSERT INTO Paris (USERNAME, ID_MATCH, Placement, teamBet) VALUES (?, ?, ?, ?)';      // on insert le paris
    connection.query(queryBet, [name, body.id_match, body.bet, body.team_bet], (error, results) => {
      if (error) {
        return callback(error, null);
      } else {      // si ça réussi, on soustrait l'argent au joueur
        const queryUser = 'UPDATE player SET tokens = tokens - ? WHERE username = ?';
        connection.query(queryUser, [body.bet, name], (error, results) => {
          if (error) {
            return callback(error, null);
          } else {
            return callback(null, results);
          }
        });
      }
    });
  }


  function newMatchInsert(body, callback) {
    // IF NOT TENNIS
    console.log(body)
    if (body.TYPE_SPORT == 'FOOTBALL' || body.TYPE_SPORT == 'BASKETBALL'){
      const queryBet = 'INSERT INTO matchs (TEAM1_ID, TEAM2_ID, ODDS_1, ODDS_2, ODDS_0, DATE_START, SPORT) VALUES (?, ?, ?, ?, ?, ?, ?)';      // on insert le paris
      connection.query(queryBet, [body.TEAM1_ID, body.TEAM2_ID, body.ODDS_1, body.ODDS_2, body.ODDS_0, body.DATE_START, body.TYPE_SPORT], (error, results) => {
        if (error) {
          console.log("0000", error)
          return callback(error, null);
        } else {      // si ça réussi, on soustrait l'argent au joueur
          return callback(null, results);
        }
      });
    } else {    // IF TENNIS
      const queryBet2 = 'INSERT INTO matchs (TEAM1_ID, TEAM2_ID, ODDS_1, ODDS_2, DATE_START, SPORT) VALUES (?, ?, ?, ?)';      // on insert le paris
      connection.query(queryBet2, [body.TEAM1_ID, body.TEAM2_ID, body.ODDS_1, body.ODDS_2, body.DATE_START, body.TYPE_SPORT], (error, results) => {
        if (error) {
          return callback(error, null);
        } else {      
              return callback(null, results);
        }
      });
    }
    
  }


module.exports = { newBetInsert, newMatchInsert }
