const router = require('express').Router()
const { errorWrap } = require('../../helpers/errors.js')
const { Task } = require('../../models')

router.get(
    '/tasks',
    errorWrap(async (_, res) => {
        const tasks = await Task.findAll()

        res.status(200).json(tasks)
    })
)

module.exports = router
