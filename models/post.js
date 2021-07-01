const { Schema, SchemaTypes, model } = require('mongoose')

const PostSchema = new Schema({
    message: {
        type: String,
        required: true
    },

    likes: {
        type: [SchemaTypes.ObjectId],
        ref: 'Users'
    }
}, { timestamps: true })

const PostModel = new model("Post", PostSchema)

module.exports = PostModel