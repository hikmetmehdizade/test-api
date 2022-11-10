const router = require('express').Router();
const { errorWrap, HttpErrors } = require('../../helpers/errors');
const { body, param, validationResult } = require('express-validator');
const validation = require('../../helpers/validation');
const models = require('../../models');

router.patch(
    '/task/:uuid',
    validation([
        param('uuid').isUUID(4).notEmpty(),
        body('isDone').isBoolean().optional(),
        body('title').isString().isLength({ min: 3 }).optional(),
    ]),
    errorWrap(async (req, res) => {
        const { uuid } = req.params;

        const task = await models.Task.findByPk(uuid);

        if (!task) {
            throw HttpErrors.NotFound('Task not found');
        }

        await task.update({ ...req.body });
        await task.save();
        const data = await task.toJSON();

        res.status(200).json(data);
    })
);

module.exports = router;
