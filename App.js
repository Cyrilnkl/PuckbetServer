//Importing modules
const express = require('express');
require("dotenv").config();
const app = express();

const connection = require('./utils/puckbet_db');
const get = require('./function/get');
const update = require('./function/update');

// je télécharge les routes
const authRoute = require('./api/auth/auth')
const routes = require('./api/routes/routes')
const admin_routes = require ('./api/routes/admin_routes')


// pour tout route de user, je redirige vers authroute
app.use('/api/user', authRoute);
app.use('/api', routes);
app.use('/admin', admin_routes);



connection.connect(error => {
    if (error){
        console.log("Oops, we encountered a problem", error);
    }
     
    //If Everything goes correct, Then start Express Server
    app.listen(process.env.DB_PORT, ()=>{
        console.log("Database connection is Ready and "
             + "Server is Listening on Port ", process.env.DB_PORT );
    })

//    connection.query("SELECT * FROM player", function (err, result, fields) {
//        if (err) throw err;
//        console.log(result);
//    });
//
//    connection.query("SELECT * FROM paris pa", function (err, result, fields) {
//        if (err) throw err;
//        console.log(result);
//    });

    //setInterval(update.updatePlayersLastLossDate, 2000);
    //setInterval(update.updateRevertTokens, 2000);

    //app.get('/users', (req, res) => {
    //    res.status(200).send()
    //})
    //
    //app.post('/users', async (req, res) => {
    //    try{    // ICI ON FAIT QUE HASHER LE PSWD
    //        console.log('ok')
    //        const salt = await bcrypt.genSalt() // ON COMMENCE PAR GÉN LE SALT PAR PERSONNE
    //        console.log('ok2')
    //        const hashedPassword = await bcrypt.hash(req.body.password, salt) // ON HASH LE PASSWORD DE L'UTILISATEUR
    //        console.log(salt)
    //        console.log(req.body.password) 
    //        console.log(hashedPassword)
    //        const user = {
    //            name : req.body.username,
    //            password : hashedPassword   // le salt est save seul dans hashedPassword
    //        }  
    //        res.status(201).send()
    //    } catch(err) {
    //        res.status(500).send(err)
    //    }  
    //})

});


