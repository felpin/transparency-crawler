const Crawler = require('crawler');

const { BASE_URL, BASE_PEOPLE_URL, BASE_PEOPLE_CLT_URL } = require('../constants');

module.exports = function createCrawler(peopleCrawler, peopleCltCrawler) {
  const crawlNextPage = $ => $('img[alt=Proximo]').parent().attr('href');

  const crawlProjectNumbers = ($) => {
    const numbers = [];
    const links = $('font[size=2] > a');

    for (let index = 0; index < links.length; index += 2) {
      numbers.push($(links[index]).html());
    }

    return numbers;
  };

  const crawler = new Crawler({
    callback: (error, res, done) => {
      if (error) {
        done();
      }

      const { $ } = res;

      const projectNumbers = crawlProjectNumbers($);
      projectNumbers.forEach((number) => {
        const urlParameters = `?wnuprojeto=${number}`;

        peopleCrawler.queue(`${BASE_PEOPLE_URL}${urlParameters}`);
        peopleCltCrawler.queue(`${BASE_PEOPLE_CLT_URL}${urlParameters}`);
      });

      const nextPage = crawlNextPage($);
      if (nextPage) {
        crawler.queue(`${BASE_URL}/${nextPage}`);
      }

      done();
    },
  });

  return crawler;
};
