const { MongoClient } = require('mongodb');
const config = require('../config');  // NEW: Import config

const uri = config.mongodb.uri;
const client = new MongoClient(uri);

const dbName = config.mongodb.dbName;
const collectionName = config.mongodb.collectionName;

let db;
let collection;
let isConnected = false;

async function connectToMongoDB() {
  if (isConnected) {
    return { success: true, db, collection };
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    db = client.db(dbName);
    collection = db.collection(collectionName);
    isConnected = true;
    
    // Create indexes
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ name: 1 });
    
    return { success: true, db, collection };
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return { success: false, error: error.message };
  }
}

async function disconnectFromMongoDB() {
  if (!isConnected) {
    return { success: true };
  }

  try {
    await client.close();
    isConnected = false;
    console.log('Disconnected from MongoDB');
    return { success: true };
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    return { success: false, error: error.message };
  }
}

function getCollection() {
  if (!isConnected) {
    throw new Error('MongoDB not connected. Call connectToMongoDB() first.');
  }
  return collection;
}

function isMongoDBConnected() {
  return isConnected;
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  getCollection,
  isMongoDBConnected
};
