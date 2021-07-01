const { config } = require('dotenv')
config()

const express = require('express')

const router = express.Router()
const { addNewUser, loginUser, storeRefreshToken, validateRefreshToken } = require('../controllers/userController')
const createNewToken = require('../utils/createNewToken')
const verifyTokenMiddleware = require('../middlewares/verifyTokenMiddleware')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

router.post('/signup', signUpPostHandler)
router.post('/login', logInPostHandler)
router.get('/token', verifyTokenMiddleware, tokenGetHandler)

async function signUpPostHandler(request, response) {
    const { body } = request
    const result = await addNewUser(body)

    if (result.error)
        response.statusCode = 400

    response.json(result)
}

async function logInPostHandler(request, response) {
    const { body } = request
    const result = await loginUser(body)

    if (result.error) {
        response.statusCode = 400
        response.send(result)

        return
    }

    const rawData = {
        username: result.username,
        timestamp: Date.now()
    }

    const refreshToken = createNewToken(rawData, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY)
    const tokens = {
        access_token: createNewToken(rawData, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY),
        refresh_token: refreshToken,
        access_token_expiry: ACCESS_TOKEN_EXPIRY,
        refresh_token_expiry: REFRESH_TOKEN_EXPIRY
    }

    const tokenStored = await storeRefreshToken(body.username, refreshToken)

    if (tokenStored.error) {
        response.statusCode = 400
        response.json(tokenStored)

        return
    }

    response.json(tokens)
}

async function tokenGetHandler(request, response) {
    try {
        const { headers } = request
        const [type, refreshToken] = headers['authorization'].split(' ')

        if (type !== 'Basic') {
            response.statusCode = 400
            response.json({ error: 'Authorization header "Basic" required' })

            return
        }

        const result = await validateRefreshToken(refreshToken, REFRESH_TOKEN_SECRET)

        if (result.error) {
            response.statusCode = 401
            response.json(result)

            return
        }

        console.log(result)

        const data = {
            username: result.username,
            timestamp: Date.now()
        }

        const tokens = {
            access_token: createNewToken(data, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY),
            refresh_token: refreshToken,
            access_token_expiry: ACCESS_TOKEN_EXPIRY,
            refresh_token_expiry: REFRESH_TOKEN_EXPIRY
        }

        response.json(tokens)
    } catch (error) {
        console.log(error)
        response.statusCode = 400
        response.json({ error: error })
    }
}


module.exports = router