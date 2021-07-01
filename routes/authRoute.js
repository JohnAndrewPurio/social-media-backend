const { config } = require('dotenv')
config()

const express = require('express')

const router = express.Router()
const { addNewUser, loginUser } = require('../controllers/userController')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

router.post('/signup', signUpPostHandler)
router.post('/login', logInPostHandler)

async function signUpPostHandler(request, response) {
    const { body } = request
    const result = await addNewUser(body)

    if(result.error)
        response.statusCode = 400

    response.json(result)
}

async function logInPostHandler(request, response) {
    const { body } = request
    const result = await loginUser(body)
    const rawData = {
        email: result.user.email,
        timestamp: Date.now()
    }

    if(result.error) {
        response.statusCode = 400
        response.send(result)

        return
    }
    
    
}

module.exports = router