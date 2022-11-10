const { param } = require('express-validator');
const { errorWrap, HttpErrors } = require('../../helpers/errors');
const { Task } = require('../../models');
const router = require('express').Router();
const validation = require('../../helpers/validation');

router.get(
    '/task/:uuid',
    validation([param('uuid').isUUID(4)]),
    errorWrap(async (req, res) => {
        const { uuid } = req.params;

        const task = await Task.findByPk(uuid);

        if (!task) {
            throw HttpErrors.NotFound('Task not found');
        }

        res.status(200).json(task);
    })
);

module.exports = router;
