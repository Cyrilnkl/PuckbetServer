const connection = require('../utils/puckbet_db')

//METTRE À JOUR LA DATE DE PERTE DES POINTS
function updatePlayersLastLossDate() {
  connection.query(`SELECT username
                      FROM player p
                      WHERE p.tokens < 1500
                      AND p.LAST_LOSS_DATE is NULL
                      AND p.username NOT IN (
                        SELECT username
                        FROM paris pa
                        WHERE pa.username = p.username
                        AND pa.STATE = 'EN COURS'
                      )`, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      const usernames = results.map(result => result.username); // FILTER RESULTS TO GET ONLY USERNAMES
      if (usernames.length === 0) {
        console.log("No players need to be updated.");
        return;
      }
      const date = new Date();
      const options = { timeZone: 'Europe/Paris' };
      const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');    // CONVERT DATE FOR THE DATABASE 
      const values = usernames.map(username => [username, formattedDate]);    // CREATE ARRAY OF [NAME, DATE TO INSERT]
      connection.query(`UPDATE player SET last_loss_date = ? WHERE username IN (?)`, [formattedDate, usernames], (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Updated last loss dates for ${results.affectedRows} players.`);
        }
      });
    }
  });
}


// REDONNER DES POINTS
function updateRevertTokens() {
  connection.query(`SELECT username, last_loss_date, tokens
                      FROM player p
                      WHERE p.last_loss_date IS NOT NULL
                      AND TIMESTAMPDIFF(HOUR, p.last_loss_date, NOW()) >= 10`, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      const usernames = results.map(result => result.username);
      if (usernames.length === 0) {
        console.log("R : Aucun joueur n'a besoin de mise à jour.");
        return;
      }
      connection.query(`UPDATE player SET tokens = 4000, last_loss_date = NULL WHERE username IN (?)`, [usernames], (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Réinitialisation des pièces et du last loss pour ${results.affectedRows} joueurs.`);
        }
      });
    }
  });
}


// changer le score des matchs + attribuer les coins
function updateScoreMatch(body, callback) {
  connection.query(
    `UPDATE matchs m
    SET m.score1 = ?,
        m.score2 = ?
    WHERE id_match = ?`,
    [body.score1, body.score2, body.id_match],
    (error, results, fields) => {
      if (error) {
        return callback(error, null);
      } else {
        const queryUser = `UPDATE matchs m, paris pa
        SET m.result = 
            CASE 
                WHEN m.score1 > m.score2 THEN 1
                WHEN m.score1 < m.score2 THEN 2
                ELSE '0'
            END,
            pa.STATE = 
            CASE
                WHEN pa.teamBet = m.result THEN 'GAGNANT' 
                ELSE 'PERDANT' 
            END
        WHERE m.ID_MATCH = pa.ID_MATCH 
        AND m.ID_MATCH = ?`;
        connection.query(queryUser, [body.id_match], (error, results) => {
          if (error) {
            return callback(error, null);
          } else {
            const queryUser = `UPDATE paris pa, player p, matchs m
            SET pa.gains = 
                CASE 
                    WHEN pa.STATE = 'GAGNANT' THEN pa.PLACEMENT * 
                        CASE pa.teamBet 
                            WHEN 1 THEN m.ODDS_1 
                            WHEN 2 THEN m.ODDS_2 
                            ELSE m.ODDS_0 
                        END 
                    ELSE 0 
                END
            WHERE m.id_match = pa.id_match
            AND pa.username = p.username
            AND m.ID_MATCH = ?`;
            connection.query(queryUser, [body.id_match], (error, results) => {
              if (error) {
                return callback(error, null);
              } else {
                const queryUser = `UPDATE player p, paris pa
                SET p.TOKENS = p.TOKENS + 
                    CASE 
                        WHEN pa.STATE = 'GAGNANT' and pa.distributed = 0 THEN pa.gains 
                        ELSE 0 
                    END,
                    pa.distributed = 1
                WHERE pa.username = p.username
                AND pa.ID_MATCH = ?
                AND pa.distributed = 0;`;
                connection.query(queryUser, [body.id_match], (error, results) => {
                  if (error) {
                    return callback(error, null);
                  } else {
                    return callback(null, results);
                  }
                });
              }
            });
          }
        });
      }
    }
  );
}







module.exports = { updatePlayersLastLossDate, updateRevertTokens, updateScoreMatch };