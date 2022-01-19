const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (req, res)=>{

    const request = await Blog.find({}).populate('user', {username:1, name:1})
    const response = request.map(r => r.toJSON())
    res.json(response)
    
})

blogsRouter.post('/',middleware.userExtractor, async (req,res,next)=>{
    
    const body = req.body
    
    if(!req.user){
       
        return 
    }
    
   
    
        
       
    
    const user = await User.findById(req.user.id)
    
    if(!user){
        
        return res.status(401).json({error : "Please login"})
    }
    const blog = new Blog({
        title: body.title,
        author : body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    try{
        
        
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
        await user.save()
            res.json(saved)
       
    

    }   catch(error){
        next(error)
    }

    
    
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
    
    if(!req.user){
        return
    }
    
    

    const target = await Blog.findById(req.params.id)
    
    const decodedToken = req.user

    
    const userId = target.user._id.toString()
    if(decodedToken.id === userId){
        await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()

    }   else{
        res.status(401).json({error : "permission denied"})
    }
    
    
    

})

blogsRouter.put('/:id', async (req, res, next) => {
    const body = req.body
    const updatedBlog = {
        title: body.title, author: body.author, url: body.url , likes : body.likes
    }
    try{
    const updated = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {new: true})
    res.json(updated)
    }   catch(error){
        next(error)
    }

})

module.exports= blogsRouter