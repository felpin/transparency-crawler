const { MongoClient } = require('mongodb');
const logger = require('pino')();

async function start() {
  try {
    const client = await MongoClient.connect('mongodb://localhost:32768/transparency', { useNewUrlParser: true });
    return client.db();
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

let _database;
async function getDatabase() {
  if (!_database) {
    _database = await start();
  }

  return _database;
}

async function writeOne(person, projects, label) {
  const database = await getDatabase();
  const collection = await database.collection('people');
  const databaseHasPerson = !!(await collection.findOne({ name: person }));

  if (databaseHasPerson) {
    await collection.updateOne({ name: person }, { $set: { [label]: projects } });
  } else {
    await collection.insertOne({ name: person, [label]: projects });
  }
}

module.exports = async function write(personMap, label) {
  const promises = [];

  for (const personMapEntry of personMap) {
    const [person, projects] = personMapEntry;
    promises.push(writeOne(person, projects, label));
  }

  await Promise.all(promises);

  logger.info(`All people of label ${label} saved successfully`);
};
