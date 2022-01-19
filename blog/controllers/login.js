const loginRoute = require('express').Router()
const jwb = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User= require('../models/user')


loginRoute.post('/', async (req,res) => {
    const body = req.body

    const user = await User.findOne({username : body.username})
    
    const passwordCorrect = user === null
    ? false
    : bcrypt.compare(body.password, user.passwordHash)

    if(!(passwordCorrect && user)){
        return res.status(401).json({
            error: "invalid username or password"
        })
    }

    const toTokenize = {
        username : user.username,
        id: user._id
    }

    const token = jwb.sign(toTokenize, process.env.SECRET)
    
    res.status(200)
        .send({token, username: user.username, name : user.name})
})



module.exports = loginRoute