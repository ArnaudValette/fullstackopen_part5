const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {required: true, type:String},
    author: String,
    url: {required: true, type:String},
    likes: Number,
    user: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ,
})

blogSchema.set("toJSON", {transform : (old, ret) => {
    ret.id = old._id.toString()
    delete ret._id
}})

module.exports= mongoose.model('Blog', blogSchema)