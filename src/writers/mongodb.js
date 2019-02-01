const logger = require('pino')();

const { getDatabase } = require('../database/mongodb');

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
