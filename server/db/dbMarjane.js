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
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  query: async (text, params = {}) => {
    await poolConnect;
    const request = pool.request();
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    return request.query(text);
  }
};
