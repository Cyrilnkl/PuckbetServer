const Joi = require('joi'); //librairie pour faire des vérifs

const registerValidation = Joi.object({        // WE DEFINE SOME VERIFICATION TO DO LATER
    username: Joi.string().min(3).required(),         // min 3 lettres // obligatoire // format string
    email: Joi.string().min(6).required().email(),      // min 6 lettres // obligatoire // mail valide
    password: Joi.string().min(6).required(),           // min 6 lettres // obligatoire
    age : Joi.number().integer().required(),
});

const loginValidation = Joi.object({        // WE DEFINE SOME VERIFICATION TO DO LATER
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

function newBetValidation(reqBody) {
    const newBet = Joi.object({
        username: Joi.string().min(3).required(),
        id_match: Joi.number().integer().required(),
        bet: Joi.number().integer().min(200).required().positive(),
        team_bet: Joi.number().integer().required().max(2).min(0),
    });

    return newBet.validate(reqBody);
}


function updateScoreParis(reqBody) {
    const updateScore = Joi.object({
        username: Joi.string().min(3).required(),
        id_match: Joi.number().integer().required(),
        score1: Joi.number().integer().required(),
        score2: Joi.number().integer().required()
    });

    return updateScore.validate(reqBody);
}

function newMatch(reqBody) {
    const newMatch = Joi.object({
        username: Joi.string().min(3).required(),
        TEAM1_ID: Joi.string().required(),
        TEAM2_ID: Joi.string().required(),
        ODDS_1: Joi.number().required(),
        ODDS_2: Joi.number().required(),
        ODDS_0: Joi.number(),
        DATE_START: Joi.date().required(),
        TYPE_SPORT: Joi.string().valid('FOOTBALL', 'BASKETBALL', 'TENNIS').required()
    });

    return newMatch.validate(reqBody);
}

 module.exports = { registerValidation, loginValidation, newBetValidation, updateScoreParis, newMatch };
