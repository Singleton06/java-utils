const xml2js = require('xml2js');

const debug = false;

const getCoordinatesFromNode = (node) => {
  const groupId = node.groupId ? node.groupId[0] : '';
  const artifactId = node.artifactId ? node.artifactId[0] : '';
  const version = node.version ? node.version[0] : '';

  return {
    groupId,
    artifactId,
    version
  }
}

const readDependenciesFromProject = (project) => {
  if (!project.dependencies || !project.dependencies[0] || !project.dependencies[0].dependency) {
    return [];
  }

  return project.dependencies[0].dependency.map((dependency) => {
    const scope = dependency.scope ? dependency.scope[0] : undefined;
    
    return {
      ...getCoordinatesFromNode(dependency),
      scope
    };
  });
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
    version,
    dependencies
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