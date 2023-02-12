/* eslint-disable no-useless-catch */
const express = require("express");
const { tr } = require("faker/lib/locales");
const { createUser, getUserByUsername } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');


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

router.post('/login', async (req, res, next) =>{
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username, password);
    console.log(user)
    console.log(user.username, username)
    console.log(user.password, password)
    console.log(user && user.password === password)
    if (user && user.password === password) {
      const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)
      res.send({ 
        message: "you're logged in!", 
        user: {
            id: user.id,
            username: user.username,
            },
        token: token});
    } else {
      res.send({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }
  } catch (error) {;
    next(error);
  }
})


// GET /api/users/me

// router.get('/users/me', async (req, res, next) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

// GET /api/users/:username/routines

module.exports = router;
