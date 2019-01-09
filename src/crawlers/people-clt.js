const Crawler = require('crawler');

const { BASE_URL } = require('../constants');

const crawlNames = ($) => {
  const names = [];
  const tableLines = $('font[size=0\\.5]')
    .first()
    .parent()
    .parent()
    .parent()
    .children();

  for (let index = 0; index < tableLines.length; index += 1) {
    const name = $(tableLines[index]).children().eq(2).text();

    if (name && name !== 'Nome Empregado') {
      names.push(name);
    }
  }

  return names;
};

const getProjectNumber = url => url.query.split('=')[1];

const peopleCltCrawler = new Crawler({
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
      done();
    }

    const { $ } = res;

    const names = crawlNames($);
    const projectNumber = getProjectNumber(res.request.uri);
    // TODO: Use the name and the project number

    done();
  },
});

module.exports = peopleCltCrawler;
