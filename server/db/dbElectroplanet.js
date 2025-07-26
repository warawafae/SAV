const sql = require('mssql');

const config = {
  user: 'SAVUSER',       // Exemple: 'sa'
  password: '12Br@',
  server: 'localhost',
  database: 'Electroplanet', 
  port: 1433,    // Nom exact de ta base
  options: {
    trustServerCertificate: true
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

/*const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = { sql, pool, poolConnect };*/
