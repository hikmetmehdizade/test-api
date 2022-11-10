const app = require('express')()
const recursive = require('recursive-readdir-sync')
const bodyParser = require('body-parser')
const { AppError } = require('./helpers/errors')
const path = require('path')

global.appRoot = path.resolve(__dirname)

app.use(bodyParser.json())

app.get('/', (_, res) => {
    res.status(200).json('hello')
})

recursive(`${__dirname}/routes`).forEach((file) =>
    app.use('/', (...args) => require(file)(...args))
)

app.use((err, _, res, next) => {
    console.log(err)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(err)
    }
    res.status(500).json(err)
    next()
})

module.exports = app
