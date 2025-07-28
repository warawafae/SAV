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
