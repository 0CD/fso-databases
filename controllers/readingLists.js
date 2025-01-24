const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', tokenExtractor, async (req, res) => {
    const readingExists = await ReadingList.findOne({
        where: {
            blogId: req.body.blogId,
            userId: req.decodedToken.id
        }
    })

    if (readingExists) {
        return res.status(400).json({ error: 'Blog is already in reading list' })
    }

    const reading = await ReadingList.create({
        blogId: req.body.blogId,
        userId: req.decodedToken.id
    })
    res.json(reading)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const readingList = await ReadingList.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!readingList) {
        return res.status(404).json({ error: 'Reading list entry not found' })
    }

    if (readingList.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
})

module.exports = router