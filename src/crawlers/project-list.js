const Crawler = require('crawler');

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
    // TODO: When on error

    const { $ } = res;

    const projectNumbers = crawlProjectNumbers($);
    const nextPage = crawlNextPage($);

    // TODO: Use the project numbers and the next page

    done();
  },
});

module.exports = projectListCrawler;
