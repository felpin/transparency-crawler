module.exports = function createMapByPerson(mapByProject) {
  const mapByPerson = new Map();

  mapByProject.forEach((people, project) => {
    people.forEach((name) => {
      if (!mapByPerson.has(name)) {
        mapByPerson.set(name, []);
      }

      mapByPerson.get(name).push(project);
    });
  });

  return mapByPerson;
};
