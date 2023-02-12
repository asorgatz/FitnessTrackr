/* eslint-disable no-useless-catch */
const express = require("express");
const { tr } = require("faker/lib/locales");
const { createUser, getUserByUsername } = require("../db");
const router = express.Router();



// POST /api/users/register
router.post('/register', async (req, res, next) => {
    try {
        const {username, password } = req.body

        
        const user = await createUser({ username, password })
        
        if (!user){
            res.send({
                error: "Username Taken",
                message: `User ${username} is already taken.`,
                name: "Username Taken"
            })
        }
        if (password.length<8){
            res.send({
                error: "Password Too Short!",
                message: "Password Too Short!",
                name: "Password Too Short!"
            })
        }
        const response = {
            message: "Registered",
            token: "TBD",
            user: {
                id: user.id,
                username: user.username
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
