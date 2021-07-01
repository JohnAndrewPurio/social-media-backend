const { config } = require('dotenv')
config()

const express = require('express')
const { verify } = require('jsonwebtoken')
const { addNewPost } = require('../controllers/postController')

const router = express.Router()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

router
    .get('/', getPostsHandler)
    .post('/', postPostHandler)


async function getPostsHandler(request, response) {

}

async function postPostHandler(request, response) {
    const { headers, body } = request
    const [ type, token ] = headers['authorization'].split(' ')
    
    const { username } = verify(token, ACCESS_TOKEN_SECRET)
    const result = await addNewPost(username, body.message)

    if(result.error)
        response.statusCode = 400

    response.json(result)
}

module.exports = router