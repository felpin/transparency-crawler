const { MongoClient } = require('mongodb');
const logger = require('pino')();

let client;
async function start() {
  try {
    client = await MongoClient.connect('mongodb://localhost:32768/transparency', { useNewUrlParser: true });
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function finish() {
  if (!client) {
    logger.info('There are no MongoDB connections to close. Skipping...');
    return;
  }

  try {
    logger.info('Closing MongoDB connection...');

    await client.close();

    logger.info('MongoDB connection closed successfully');
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

let database;
async function getDatabase() {
  if (!database) {
    await start();
    database = client.db();
  }

  return database;
}

module.exports = { start, finish, getDatabase };
