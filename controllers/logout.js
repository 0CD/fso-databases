const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
    await Session.destroy({
        where: {
            userId: req.decodedToken.id,
            token: req.get('authorization').substring(7)
        }
    })
    res.status(204).end()
})

module.exports = router