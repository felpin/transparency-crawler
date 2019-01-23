module.exports = function createMapByPerson(mapByProject) {
  const mapByPerson = new Map();

  mapByProject.forEach((project, people) => {
    people.forEach((name) => {
      if (!mapByPerson.has(name)) {
        mapByPerson.set(name, []);
      }

      mapByPerson.get(name).push(project);
    });
  });

  return mapByPerson;
};
