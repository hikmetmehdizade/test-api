const { validationResult } = require('express-validator');
const { errorWrap, HttpErrors } = require('./errors');
const validation = (schema) =>
    errorWrap(async (req, _, next) => {
        await Promise.all(schema.map((valid) => valid.run(req)));
        const valRes = validationResult(req);
        if (valRes.isEmpty()) return next();
        const errorMessages = valRes
            .array()
            .map(
                (err) =>
                    `${err.msg} ${err.param} in ${err.location} - ${err.value}`
            )
            .join(', ');

        throw HttpErrors.BadRequest(errorMessages);
    });

module.exports = validation;
