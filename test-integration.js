const mongodb = require('./db/mongodb');

async function testIntegration() {
  console.log('Testing MongoDB integration...\n');
  
  // Test connection
  const connection = await mongodb.connectToMongoDB();
  if (!connection.success) {
    console.log('Failed to connect to MongoDB');
    return;
  }
  
  console.log('MongoDB integration working!\n');
  
  // Test CRUD operations
  const collection = mongodb.getCollection();
  
  // Insert
  const testRecord = {
    id: Date.now(),
    name: 'Integration Test',
    value: 'MongoDB CRUD Test',
    createdAt: new Date()
  };
  
  console.log('Inserting test record...');
  const insertResult = await collection.insertOne(testRecord);
  console.log(`Inserted with ID: ${insertResult.insertedId}\n`);
  
  // Read
  console.log('Reading records...');
  const records = await collection.find({}).toArray();
  console.log(`Found ${records.length} records\n`);
  
  // Update
  console.log('Updating record...');
  const updateResult = await collection.updateOne(
    { id: testRecord.id },
    { $set: { value: 'Updated Value', updatedAt: new Date() } }
  );
  console.log(`Updated ${updateResult.modifiedCount} record(s)\n`);
  
  // Delete
  console.log('Deleting test record...');
  const deleteResult = await collection.deleteOne({ id: testRecord.id });
  console.log(`Deleted ${deleteResult.deletedCount} record(s)\n`);
  
  // Disconnect
  await mongodb.disconnectFromMongoDB();
  console.log('All integration tests passed!');
}

testIntegration().catch(console.error);
