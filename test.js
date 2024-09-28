const { MongoClient } = require('mongodb');

const url = "mongodb+srv://tqanhtkqn:L2EEhNhOaXz7ufEn@qta.jpirv.mongodb.net/?retryWrites=true&w=majority&appName=QTA";

async function connectToDatabase() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    const dbo = client.db("chatbot");
    console.log("Database connected!");
    // Perform any database operations here
  } catch (err) {
    console.error("Failed to connect to the database", err);
  } finally {
    await client.close();
  }
}

connectToDatabase();