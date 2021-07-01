const { connection } = require('mongoose')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const generatePasswordHash = require('../utils/generatePasswordHash')

const validEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

async function addNewUser({ username, email, password }) {
    if(!validEmail.test(email)) 
        return { error: 'Invalid email' }

    try {
        const schema = {
            username, email,
            password: await generatePasswordHash(password)
        }

        const user = new UserModel(schema)
        await user.save()

        return `User ${ username } succesfully added to database`
    } catch (error) {
        return { error: error }
    }
}

async function loginUser({username, password}) {
    try {
        const user = await UserModel.findOne({ username: username })

        if(!user) 
            return { error: 'Incorrect Username'}

        const passwordHash = await bcrypt.compare(password, user.password)

        if(!passwordHash)
            return { error: 'Incorrect Password' }
        
        return user
    } catch(error) {
        return { error: error }
    }
}

async function storeRefreshToken(username, refreshToken) {
    try {
        await UserModel.updateOne({ username: username }, { refreshToken: refreshToken })

        return 'Refresh token stored in the database'
    } catch (error) {
        return { error: error }
    }
}

module.exports = {
    addNewUser, loginUser, storeRefreshToken
}