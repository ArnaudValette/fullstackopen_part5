const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const requestLogger = (request, response, next) => {
    logger.info(`${request.method} -- ${request.path} -- ${request.body} ---`)
    
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === "ValidationError"){
        response.status(400).json({error : error.message})
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint !!!'})
}

const tokenHandler = (req, res, next) => {

    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        req.token = authorization.substring(7)
        
        
    }

    next()

    
}

const userExtractor = (req, res, next) => {
    
    jwt.verify(req.token, process.env.SECRET, (err, result) => {
        if(err){
            
            res.status(401).json({error : "Invalid token, please login"})
            
            
        }   else{
            req.user = result
            
        }
       
        
    })

    

    next()

    
}

module.exports= {
    errorHandler,
    requestLogger,
    unknownEndpoint,
    tokenHandler,
    userExtractor
}