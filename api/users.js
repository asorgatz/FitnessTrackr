/* eslint-disable no-useless-catch */
const express = require("express");
const { tr } = require("faker/lib/locales");
const { createUser, getUserByUsername, getUserById, getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


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

router.get('/me', async (req, res, next) => {
    
    const prefix = 'Bearer ';
    const auth = req.header('Authorization')

    if(!auth) {
        next(res.status(401).send({
            error:"Invalid Token",
            message:"You must be logged in to perform this action",
            name:"Invalid Token"
        }));
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        
        try{
            const { id } = jwt.verify(token, JWT_SECRET);
            
            if (id) {
                req.user = await getUserById(id);
                res.send(req.user)
            }
        } catch (error) {
            throw error
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }
})

// GET /api/users/:username/routines

router.get('/:username/routines', async (req, res, next) => {
    const {username} = req.params
    const prefix = 'Bearer ';
    const auth = req.header('Authorization')
    const token = auth.slice(prefix.length);
    
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log(id)
    const localUser = await getUserById(id)
    console.log(localUser)

    if(!auth) {
        next(res.status(401).send({
            error:"Invalid Token",
            message:"You must be logged in to perform this action",
            name:"Invalid Token"
        }));
    } else if (auth.startsWith(prefix)) {
        try{
            if (username === localUser.username) {
                const routines = await getAllRoutinesByUser({username})
                console.log(username, localUser.username)
                res.send(routines)
            } else {
                const publicRoutines = await getPublicRoutinesByUser({username})
                console.log("proutines", publicRoutines)
                res.send(publicRoutines)
            }
        } catch (error) {
            throw error
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }

    // try{
    //     const routines = await getAllRoutinesByUser(username)
    //     res.send(routines)
    // } catch {
    //     throw error
    // }
})

module.exports = router;
