const projectListCrawlerFactory = require('./src/crawlers/project-list');
const peopleCrawlerConfiguration = require('./src/crawlers/configurations/people/people-configuration');
const peopleCltCrawlerConfiguration = require('./src/crawlers/configurations/people/people-clt-configuration');
const peopleCrawlerFactory = require('./src/crawlers/people');
const { BASE_URL } = require('./src/constants');

const peopleCrawler = peopleCrawlerFactory(peopleCrawlerConfiguration);
const peopleCltCrawler = peopleCrawlerFactory(peopleCltCrawlerConfiguration);
const projectListCrawler = projectListCrawlerFactory(peopleCrawler, peopleCltCrawler);

projectListCrawler.queue(`${BASE_URL}/swfwfap151`);
