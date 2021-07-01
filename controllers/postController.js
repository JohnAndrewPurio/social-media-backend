const UserModel = require('../models/user')
const PostModel = require('../models/post')

async function addNewPost(username, message) {
    try {
        const user = await UserModel.findOne({ username: username }) 

        if(!user)
            return { error: 'There is no such username in the database' }

        const schema = {
            message: message
        }

        const post = new PostModel(schema)
        const result = await post.save()

        return result
    } catch (error) {
        return { error: error }
    }
}

async function getAllPostsOfUser() {
    
}

module.exports = {
    addNewPost
}