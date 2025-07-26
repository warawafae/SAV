const sql = require('mssql');

const config = {
  user: 'SAVUSER',
  password: '12Br@',
  server: 'localhost',
  database: 'Marjane',
  port: 1433,
    options: {
        trustServerCertificate: true  // ← indispensable en local
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database connection failed: ', err));

module.exports = {
    sql, poolPromise
};