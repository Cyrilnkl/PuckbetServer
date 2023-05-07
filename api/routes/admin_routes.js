const router = require('express').Router()  // on crée un router pour faire en sorte de pouvoir l'appeler directement d'ici

const connection = require('../../utils/puckbet_db')

const validation = require('../../sql_requests/validation')

// on doit définir le format pour bien recevoir les données
const express = require('express')
router.use(express.json());

const userFind = require('../../sql_requests/user')

//pour protéger les demandes
const auth_jwt = require('../../sql_requests/jwt')

const insert = require('../../function/insert')
const update = require('../../function/update')


//           UPDATE DES PARIS           \\

router.post('/update_score_paris', auth_jwt.auth, async (req, res) => {

    const { error, value } = validation.updateScoreParis(req.body);     // WE GIVE THE SCHEMA TO CHECK AND THE REF
    if(error) return res.status(404).send(error.details[0].message);


    // on vérifie le nom et récup les données du compte
    const resultUsername = await userFind.findUserByName(req.user.username);
    if (resultUsername.length == 0) { 
        return res.status(404).send("This username doesn't exist")
    }

    // on vérifie que le nombre de coins est suffisant 
    if (resultUsername[0].role != 'admin'){
        return res.status(404).send("Access forbidden !")
    }

    update.updateScoreMatch(req.body, (error, results) => {       
        if (error) {
        return res.status(500).send('Failed to update score');
        } else {
        return res.status(200).send('Score updated successfully');
        }
    });
});


//           AJOUT DE MATCHS           \\

router.post('/add_matchs', auth_jwt.auth, async (req, res) => {


    console.log("91")

    const { error, value } = validation.newMatch(req.body);     // WE GIVE THE SCHEMA TO CHECK AND THE REF
    if(error) return res.status(404).send(error.details[0].message);



    // on vérifie le nom et récup les données du compte
    const resultUsername = await userFind.findUserByName(req.user.username);
    if (resultUsername.length == 0) { 
        return res.status(404).send("This username doesn't exist")
    }

    // on vérifie que le nombre de coins est suffisant 
    if (resultUsername[0].role != 'admin'){
        return res.status(404).send("Access forbidden !")
    }

    insert.newMatchInsert(req.body, (error, results) => {       
        if (error) {
        return res.status(500).send('Failed to add your match (check team\'s id or the match already exist !)');
        } else {
        return res.status(200).send('Match added successfully');
        }
    });
});



module.exports = router;