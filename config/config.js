const { DB_PASSWORD, DB_USERNAME, DB_NAME, DB_PORT, DB_HOST } = process.env;

module.exports = {
    development: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
    },
    test: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
    },
    production: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
    },
};
