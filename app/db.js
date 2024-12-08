const { Pool } = require('pg');
const pool = new Pool({
    user: 'nutech',
    host: 'localhost',
    database: 'nutech_test',
    password: 'nutech',
    port: 5432,
});

module.exports = pool;
