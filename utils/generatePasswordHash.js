const bcrypt = require('bcrypt')

async function generatePasswordHash(password) {
    try {
        const hash = await bcrypt.hash(password, 10)

        return hash
    } catch(e) {
        console.log(e)
    }
}

module.exports = generatePasswordHash