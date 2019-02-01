require('dotenv').config();
const EventEmitter = require('events');

const projectListCrawlerFactory = require('./src/crawlers/project-list');
const peopleCrawlerConfiguration = require('./src/crawlers/configurations/people/people-configuration');
const peopleCltCrawlerConfiguration = require('./src/crawlers/configurations/people/people-clt-configuration');
const peopleCrawlerFactory = require('./src/crawlers/people');
const { BASE_URL } = require('./src/constants');
const createMapByPerson = require('./src/transformers/create-map-by-person');
const writeToMongoDb = require('./src/writers/mongodb');
const { start: startDatabaseConnection, finish: finishDatabaseConnection } = require('./src/database/mongodb');

const {
  crawler: peopleCrawler,
  result: peopleResult,
} = peopleCrawlerFactory(peopleCrawlerConfiguration);

const {
  crawler: peopleCltCrawler,
  result: peopleCltResult,
} = peopleCrawlerFactory(peopleCltCrawlerConfiguration);

const projectListCrawler = projectListCrawlerFactory(peopleCrawler, peopleCltCrawler);

const TOTAL_CRAWLERS = 3;

(async () => {
  await startDatabaseConnection();

  const drainEmitter = new EventEmitter();

  let crawlersDrained = 0;
  drainEmitter.on('drain', async () => {
    crawlersDrained += 1;

    if (crawlersDrained === TOTAL_CRAWLERS) {
      await finishDatabaseConnection();
    }
  });

  projectListCrawler.queue(`${BASE_URL}/swfwfap151`);

  projectListCrawler.on('drain', () => {
    const createPeopleDrainHandler = (result, label) => async () => {
      const mapByPerson = createMapByPerson(result);
      await writeToMongoDb(mapByPerson, label);

      drainEmitter.emit('drain');
    };

    peopleCrawler.on('drain', createPeopleDrainHandler(peopleResult, 'clt'));
    peopleCltCrawler.on('drain', createPeopleDrainHandler(peopleCltResult, 'people'));

    drainEmitter.emit('drain');
  });
})();
