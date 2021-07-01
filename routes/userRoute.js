const express = require('express')

const router = express.Router()

router
    .patch('/follow', patchFollowHandler)
    .patch('/unfollow', patchUnfollowHandler)

async function patchFollowHandler(request, response) {

}

async function patchUnfollowHandler(request, response) {

}

module.exports = router