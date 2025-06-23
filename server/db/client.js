const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/fs_site_review');

module.exports = client