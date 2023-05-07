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



//           AJOUTER DES PARIS           \\

router.post('/add_paris', auth_jwt.auth, async (req, res) => {

    const { error, value } = validation.newBetValidation(req.body);     // WE GIVE THE SCHEMA TO CHECK AND THE REF
    if(error) return res.status(404).send(error.details[0].message);

    console.log(req.user)
    console.log(req.body)

    // on vérifie le nom et récup les données du compte
    const resultUsername = await userFind.findUserByName(req.user.username);
    if (resultUsername.length == 0) { 
        return res.status(404).send("This username doesn't exist")
    }

    



    // on vérifie que le nombre de coins est suffisant 
    if (resultUsername[0].TOKENS < req.body.bet){
        return res.status(422).send("Not enough coins !")
    }

    insert.newBetInsert(resultUsername[0].USERNAME, req.body, (error, results) => {        // on passe les données récup pour éviter une usurpation ..
        if (error) {
        //console.log(error)
        return res.status(500).send('Problems with this match !');
        } else {
        return res.status(201).send('bet created successfully !');
        }
    })
});



// on exporte tout
module.exports = router;