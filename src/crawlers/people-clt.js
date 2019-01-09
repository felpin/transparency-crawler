const Crawler = require('crawler');

const result = new Map();

const crawlNames = ($) => {
  const names = new Set();
  const tableLines = $('font[size=0\\.5]')
    .first()
    .parent()
    .parent()
    .parent()
    .children();

  for (let index = 0; index < tableLines.length; index += 1) {
    const name = $(tableLines[index]).children().eq(2).text();

    if (name && name !== 'Nome Empregado') {
      names.add(name);
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

    if (names.size) {
      result.set(projectNumber, Array.from(names));
    }

    done();
  },
});


module.exports = {
  crawler: peopleCltCrawler,
  result,
};
