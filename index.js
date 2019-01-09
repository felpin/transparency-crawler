const projectListCrawler = require('./src/crawlers/project-list');
const { BASE_URL } = require('./src/constants');

projectListCrawler.queue(`${BASE_URL}/swfwfap151`);
