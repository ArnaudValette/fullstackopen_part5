const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { error } = require('../utils/logger')

userRouter.post('/' , async (req, res, next) => {
    const body = req.body
    if(!req.body.password || req.body.password.length < 3){
        return res.status(400).json({error : "a password of at least 3 caracters is required"})
        
    }
    try{

    const passwordHash = await bcrypt.hash(body.password, 10)

    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await newUser.save()

    res.json(savedUser)
    }
    catch(exception){
        next(exception)
    }
})

userRouter.get('/', async (req, res) => {
    const listOfUser = await User.find({}).populate('blogs', {title: 1, author: 1, url :1})

    const response = listOfUser.map(m => m.toJSON())
    res.json(response)

})



module.exports = userRouter