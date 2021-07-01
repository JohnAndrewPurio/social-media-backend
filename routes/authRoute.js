const { config } = require('dotenv')
config()

const express = require('express')

const router = express.Router()
const { addNewUser, loginUser, storeRefreshToken } = require('../controllers/userController')
const createNewToken = require('../utils/createNewToken')

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

    console.log(result)

    const rawData = {
        email: result.user.email,
        timestamp: Date.now()
    }

    if(result.error) {
        response.statusCode = 400
        response.send(result)

        return
    }
    
    const refreshToken = createNewToken(rawData, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY)
    const tokens = {
        access_token: createNewToken(rawData, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY),
        refresh_token: refreshToken,
        access_token_expiry: ACCESS_TOKEN_EXPIRY,
        refresh_token_expiry: REFRESH_TOKEN_EXPIRY
    }

    const tokenStored = await storeRefreshToken(body.username, refreshToken)

    response.json(tokens)
}

module.exports = router