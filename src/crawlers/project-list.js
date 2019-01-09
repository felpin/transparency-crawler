const Crawler = require('crawler');

const { BASE_URL, BASE_CLT_URL } = require('../constants');
const peopleCltCrawler = require('./people-clt');

const crawlNextPage = $ => $('img[alt=Proximo]').parent().attr('href');

const crawlProjectNumbers = ($) => {
  const numbers = [];
  const links = $('font[size=2] > a');

  for (let index = 0; index < links.length; index += 2) {
    numbers.push($(links[index]).html());
  }

  return numbers;
};

const projectListCrawler = new Crawler({
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
      done();
    }

    const { $ } = res;

    const projectNumbers = crawlProjectNumbers($);
    projectNumbers.forEach(number => peopleCltCrawler.queue(`${BASE_CLT_URL}?wnuprojeto=${number}`));

    const nextPage = crawlNextPage($);
    if (nextPage) {
      projectListCrawler.queue(`${BASE_URL}/${nextPage}`);
    }

    done();
  },
});

module.exports = projectListCrawler;
