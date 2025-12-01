const config = require('./config');

console.log('🔧 Configuration Test\n');
console.log('=====================\n');

console.log('MongoDB Configuration:');
console.log(`  URI: ${config.mongodb.uri}`);
console.log(`  Database: ${config.mongodb.dbName}`);
console.log(`  Collection: ${config.mongodb.collectionName}\n`);

console.log('Application Configuration:');
console.log(`  Port: ${config.app.port}`);
console.log(`  Environment: ${config.app.nodeEnv}`);
console.log(`  Log Level: ${config.app.logLevel}\n`);

console.log('Paths Configuration:');
console.log(`  Data Directory: ${config.paths.dataDir}`);
console.log(`  Backup Directory: ${config.paths.backupDir}`);
console.log(`  Export File: ${config.paths.exportFile}\n`);

console.log('Feature Flags:');
console.log(`  Backup Enabled: ${config.features.enableBackup}`);
console.log(`  Logging Enabled: ${config.features.enableLogging}\n`);

console.log('✅ Configuration loaded successfully!');

// Test environment variable override
console.log('\n🧪 Testing environment variable override...');
process.env.MONGODB_URI = 'mongodb://test:27017';
delete require.cache[require.resolve('./config')];
const newConfig = require('./config');
console.log(`Updated MongoDB URI: ${newConfig.mongodb.uri}`);
