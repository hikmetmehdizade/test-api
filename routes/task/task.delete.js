const router = require('express').Router()
const { body } = require('express-validator')
const { errorWrap, HttpErrors } = require('../../helpers/errors')
const validation = require('../../helpers/validation')
const models = require('../../models')

router.delete(
    '/task/:uuid',
    validation([body('uuid').isUUID(4)]),
    errorWrap(async (req, res) => {
        const { uuid } = req.params
        const task = await models.task.findByPk(uuid)

        if (!task) {
            throw HttpErrors.NotFound('task not found')
        }
        await task.destroy()

        res.status(204).json('Task deleted successfully')
    })
)

module.exports = router
