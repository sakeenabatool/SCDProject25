const fs = require('fs');
const path = require('path');
const config = require('../config');  // Add this line

const dataDir = path.join(__dirname, '..', config.paths.dataDir);  // Changed
const dbFile = path.join(dataDir, 'vault.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, '[]');
}
function readDB() {
  const data = fs.readFileSync(dbFile, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
