const { config } = require('dotenv')
config()

const { verify } = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

async function verifyTokenMiddleware(request, response, next) {
    const { headers } = request
    const [ type, token ] = headers['authorization'].split(' ')
    const secret = type === 'Basic' ? REFRESH_TOKEN_SECRET
        : type === 'Bearer' ? ACCESS_TOKEN_SECRET
        : ''

    try {
        await verify(token, secret)

        next()
    } catch(error) {
        response.statusCode = 403
        response.json({ error: error })
    }
}

module.exports = verifyTokenMiddleware