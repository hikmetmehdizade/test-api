const router = require('express').Router();
const { param } = require('express-validator');
const { errorWrap, HttpErrors } = require('../../helpers/errors');
const validation = require('../../helpers/validation');
const models = require('../../models');

router.delete(
    '/task/:uuid',
    validation([param('uuid').isUUID(4)]),
    errorWrap(async (req, res) => {
        const { uuid } = req.params;
        const task = await models.Task.findByPk(uuid);

        if (!task) {
            throw HttpErrors.NotFound('Task not found');
        }
        await task.destroy();

        res.sendStatus(204);
    })
);

module.exports = router;
