const connection = require('../utils/puckbet_db');

// function to find user by name
  function findUserByName(username) {
    const query = `SELECT * FROM player WHERE username = '${username}'`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  // function to find user by email
  function findUserByEmail(email) {
    const query = `SELECT * FROM player WHERE email = '${email}'`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }


  // pour créer l'utilisateur 

  function createUser(user, callback) {
    console.log(user)
    const query = `INSERT INTO player (username, email, password, age) VALUES (?, ?, ?, ?)`;
    connection.query(query, [user.username, user.email, user.password, user.age], (error, results) => {
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, results);
      }
    });
  }

  module.exports = { findUserByEmail, findUserByName, createUser }