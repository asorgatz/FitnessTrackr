/* eslint-disable no-useless-catch */
const express = require("express");
const { tr } = require("faker/lib/locales");
const { createUser } = require("../db");
const router = express.Router();



// POST /api/users/register
router.post('/register', async (req, res, next) => {
    try {
        const {username, password } = req.body
        
        
        const register = await createUser({ username, password })

        const response = {
            message: "Registered",
            token: "TBD",
            user: {
                id: register.id,
                username: register.username
            }
        }
        
        res.send(response)
    } catch (error) {
        next(error)
    }
})

// POST /api/users/login


// GET /api/users/me

// router.get('/users/me', async (req, res, next) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

// GET /api/users/:username/routines

module.exports = router;
