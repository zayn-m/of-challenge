const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/todoList';
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: async function (callback) {
    try {
        if (dbConnection) return;
        const db = await client.connect();
        dbConnection = db.db("todoList");
        console.log("Successfully connected to MongoDB");

        if (callback) callback(dbConnection);
    } catch (error) {
        console.log('Error in connecting DB', error);
    }
  },

  getDb: function () {
    return dbConnection;
  },
};