const blogsRouter = require("../controllers/blogs")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sumOfLikes, item) => {
        return sumOfLikes + item.likes
    }

    return blogs.length === 0 ? 
    0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs)=> {
    const reducer = (greatest, candidat)=>{
        
        return Math.max(greatest, candidat.likes)
    }

    const maxNumberOfLikes = blogs.reduce(reducer, 0)
    return blogs.length === 0 ? [] : blogs.find(element => element.likes === maxNumberOfLikes)
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return []
    }
    
    const summingUp = (summedUpList, input) => {
        if(summedUpList.length === 0){
            summedUpList.push({author: input.author, blogs : 1 })
        }   else if(!summedUpList.find(e => e.author === input.author)){
            summedUpList.push({author: input.author, blogs: 1})
        }   else{
            summedUpList[summedUpList.findIndex(e => e.author === input.author)].blogs++
        }
        return summedUpList
    }

    const findMostVerbose = (mostVerbose, input) => {
        return mostVerbose.blogs < input.blogs ? input : mostVerbose
    }

    
    let authorWithMostBlogs = blogs
                            .reduce(summingUp, [])
                            .reduce(findMostVerbose, {blogs: 0})
    
    return authorWithMostBlogs
    
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return []
    }

    const singleOccurence = (list, input) => {
        if(list.find(e => e.author === input.author)){
            
            list[list.findIndex(e => e.author === input.author)].likes = list[list.findIndex(e => e.author === input.author)].likes + input.likes
        }   else{
            
            list.push({author : input.author, likes: input.likes})
            
        }

        
        return list
    }
    

    const findMostLiked = (mostLiked, input) => mostLiked.likes < input.likes ? input : mostLiked

    return blogs
            .reduce(singleOccurence, [])
            .reduce(findMostLiked, {likes: 0})

}



  
    



module.exports= {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}