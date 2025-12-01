const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully!');

    // List databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    
    console.log('\nAvailable databases:');
    dbList.databases.forEach(db => {
      console.log(`  • ${db.name} (size: ${db.sizeOnDisk} bytes)`);
    });

    // Test creating/using a database
    const testDb = client.db('nodevault_test');
    const testCollection = testDb.collection('test_records');
    
    // Insert test data
    const testDoc = {
      name: 'Test Record',
      value: 'MongoDB is working!',
      timestamp: new Date(),
      id: Date.now()
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`\nInserted test document with ID: ${insertResult.insertedId}`);
    
    // Count documents
    const count = await testCollection.countDocuments();
    console.log(`Total documents in collection: ${count}`);
    
    // Find and display documents
    const documents = await testCollection.find({}).toArray();
    console.log('\nDocuments in collection:');
    documents.forEach(doc => {
      console.log(`  • ${doc.name}: ${doc.value} (ID: ${doc.id})`);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

testConnection();
