const dbElectro = require('./dbElectroplanet');
const dbMarjane = require('./dbMarjane');

function getDbByEnseigne(enseigne) {
  if (enseigne.toLowerCase() === 'Electroplanet') return dbElectroplanet;
  if (enseigne.toLowerCase() === 'Marjane') return dbMarjane;
  throw new Error('Enseigne inconnue');
}

module.exports = getDbByEnseigne;
