const { MongoClient } = require('mongodb');
require('dotenv').config();

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('Blog10');
    console.log('Connected to DB:', db.databaseName);
    const col = db.collection('ideas');
    const r = await col.insertOne({ test: true, createdAt: new Date() });
    console.log('Inserted test document id:', r.insertedId);
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
})();