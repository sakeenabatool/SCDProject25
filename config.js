require('dotenv').config();

const config = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'nodevault',
    collectionName: process.env.MONGODB_COLLECTION_NAME || 'records'
  },
  
  // Application Configuration
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  
  // File System Configuration
  paths: {
    dataDir: process.env.DATA_DIR || './data',
    backupDir: process.env.BACKUP_DIR || './backups',
    exportFile: process.env.EXPORT_FILE || 'export.txt'
  },
  
  // Feature Flags
  features: {
    enableBackup: process.env.ENABLE_BACKUP !== 'false', // true by default
    enableLogging: process.env.ENABLE_LOGGING !== 'false' // true by default
  },
  
  // Validation
  validate: function() {
    const required = ['MONGODB_URI'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
      console.warn('Using default values where available.');
    }
    
    // Validate MongoDB URI format
    if (this.mongodb.uri && !this.mongodb.uri.startsWith('mongodb://') && !this.mongodb.uri.startsWith('mongodb+srv://')) {
      console.warn('⚠️  MONGODB_URI should start with mongodb:// or mongodb+srv://');
    }
    
    return this;
  }
};

// Export validated configuration
module.exports = config.validate();
