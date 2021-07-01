const { Schema, SchemaTypes, model } = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    posts: {
        type: [ SchemaTypes.ObjectId ],
        ref: 'Posts'
    },

    followers: {
        type: [ SchemaTypes.ObjectId ],
        ref: 'Users'
    },

    following: {
        type: [ SchemaTypes.ObjectId ],
        ref: 'Users'
    }

}, { timestamps: true })

const UserModel = new model("User", UserSchema)

module.exports = UserModel