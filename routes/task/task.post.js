const router = require('express').Router();
const { errorWrap } = require('../../helpers/errors');
const { body } = require('express-validator');
const validation = require('../../helpers/validation');
const { Task } = require('../../models');

router.post(
    '/task',
    validation([
        body('title').isString().isLength({ min: 3 }).notEmpty(),
        body('isDone').isBoolean().optional(),
    ]),
    errorWrap(async (req, res) => {
        const { title, isDone } = req.body;
        const created = await Task.create({ title, isDone });
        res.status(201).json(created);
    })
);

module.exports = router;
