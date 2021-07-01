const jwt = require('jsonwebtoken')

function createNewToken(data, tokenSecret, tokenExpiry) {
    const token = jwt.sign(data, tokenSecret, { expiresIn: tokenExpiry })
    
    return token
}

module.exports = createNewToken