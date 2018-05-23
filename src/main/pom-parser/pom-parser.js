const xml2js = require('xml2js');

const debug = false;

const readDependenciesFromProject = (project) => {
  if (!project.dependencies || !project.dependencies[0] || !project.dependencies[0].dependency) {
    return [];
  }
};

const buildJSONStructure = (project) => {
  const groupId = project.groupId ? project.groupId[0] : '';
  const artifactId = project.artifactId ? project.artifactId[0] : '';
  const version = project.version ? project.version[0] : '';

  const dependencies = readDependenciesFromProject(project);

  if (debug) {
    return {
      dependencies: project.dependencies
    }
  }


  return {
    groupId,
    artifactId,
    version
  };
};

const parsePOMFromString = (pomContents) => {
  return new Promise((resolve) => {
    return xml2js.parseString(pomContents, (err, result) => {
      resolve(result);
    });
  }).then(result => result.project)
    .then(buildJSONStructure);
};


module.exports = {parsePOMFromString};