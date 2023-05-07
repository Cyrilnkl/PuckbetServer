const router = require('express').Router()  // on crée un router pour faire en sorte de pouvoir l'appeler directement d'ici

// to create tokens ==> + safe
const jwt = require('jsonwebtoken')

// validation fields
const validation = require('../../sql_requests/validation')

// TO HASH THE PASSWORD :
const bcrypt = require('bcrypt');

// on doit définir le format pour bien recevoir les données
const express = require('express')
router.use(express.json());

const userFind = require('../../sql_requests/user')


// register

router.post('/register', async (req, res) => {
    try{
        // WE DO THE VERIFICATIONS BEFORE THE CREATION OF A USER
        const {error, value} = validation.registerValidation.validate(req.body);     // WE GIVE THE SCHEMA TO CHECK AND THE REF
        if(error) return res.status(400).send(error.details[0].message);



        // ON VERIFIE SI L'EMAIL EXISTE DÉJÀ, ON COMMENCE PAR RÉCUP LES MAILS
        const resultMail = await userFind.findUserByEmail(req.body.email);
        if (resultMail.length > 0) { 
            return res.status(409).send("This email is already registered")
        }



        // ON VERIFIE SI L'USERNAME EXISTE DÉJÀ, ON COMMENCE PAR RÉCUP LES MAILS
        const resultUsername = await userFind.findUserByName(req.body.username);
        if (resultUsername.length > 0) { 
            return res.status(409).send("This username is already registered")
        }

        // si on arrive ici c'est que le nom d'utilisateur et le mail sont uniques


        const salt = await bcrypt.genSalt() // ON COMMENCE PAR GÉN LE SALT PAR PERSONNE
        const hashedPassword = await bcrypt.hash(req.body.password, salt) // ON HASH LE PASSWORD DE L'UTILISATEUR


        // on crée l'object de l'utilisateur
        const user = {
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,   // le salt est save seul dans hashedPassword
            age : req.body.age,
        }

        
        // Insert the user into the database
        userFind.createUser(user, (error, results) => {
            console.log(user)
        if (error) {
          return res.status(500).send('Failed to create user');
        } else {
           return res.status(201).send('User created successfully');
        }
      });
    } catch(err) {
        res.status(500).send(err)
    }  
})



// login

router.post('/login', async (req, res) => {
    // on vérifie le format des données
    const {error, value} = validation.loginValidation.validate(req.body);     // WE GIVE THE SCHEMA TO CHECK AND THE REF
        if(error) return res.status(400).send(error.details[0].message);

    //check if username exist by getting al its info
    const resultUsername = await userFind.findUserByName(req.body.username);
        if (resultUsername.length == 0) { 
            return res.status(409).send("This username doesn't exist");
        }
    

    //ckeck the pass and valid it 
    const validPassword = await bcrypt.compare(req.body.password, resultUsername[0].password); 
    if(!validPassword) return res.status(403).send('Wrong Password !');


    // ON CRÉE PUIS ON ENVOIE LE TOKEN ( on choisit aussi ce qu'on veut inclure dedans )
    const token = jwt.sign({username: resultUsername[0].USERNAME, role: resultUsername[0].role}, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send(token);

});

// on exporte tout
module.exports = router;