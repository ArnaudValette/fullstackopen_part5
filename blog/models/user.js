const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        minlength:3,
        unique: true,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    passwordHash :  String,
    blogs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
        
    
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {transform : (doc, ret) => {
    ret.id = doc._id
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
}})

module.exports = mongoose.model('User', userSchema)