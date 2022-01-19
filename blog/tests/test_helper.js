const Blog = require('../models/blog')
const User = require('../models/user')

const initialList = [{
    title: "Blogish",
    author: "Tornado76", 
    url: "http://www.blogish.xyz",
    likes: 240
},{
    title: "Verite",
    author:"LostInTranslation",
    url:"http://www.noway.url",
    likes: 354
},{
    title: "NoCR",
    author:"Anon",
    url:"http://www.copyright.rip",
    likes: 2
}]

const initialUsers = [{
    username: "root",
    name: "superuser",
    password: "dckdckdckMLLNMLLNMLLN103103103"
}]

const getDbData = async () => {
    const response = await Blog.find({})

    return response.map(r => r.toJSON())
}

const getUsr = async () => {
    const response = await User.find({})

    return response.map(u => u.toJSON())
}




module.exports = {getDbData, initialList, initialUsers, getUsr
}