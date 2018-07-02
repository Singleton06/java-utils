const xml2js = require("xml2js");
const axios = require("axios");
const emptyPromise = new Promise(resolve => resolve(undefined));

const getCoordinatesFromNode = node => {
  //parent checks work on the same level as the node so it is not possible for parents or dependencies
  const groupId = node.groupId ? node.groupId[0] : node.parent ? getCoordinatesFromNode(node.parent[0]).groupId : undefined;
  const artifactId = node.artifactId ? node.artifactId[0] : undefined;
  const version = node.version ? node.version[0] : node.parent ? getCoordinatesFromNode(node.parent[0]).version : undefined;

  return {
    groupId,
    artifactId,
    version
  };
};

const getRepositoryPolicy = release => {
  const enabled = release.enabled ? release.enabled[0] : undefined;
  const updatePolicy = release.updatePolicy ? release.updatePolicy[0] : undefined;
  const checksumPolicy = release.checksumPolicy ? release.checksumPolicy[0] : undefined;

  return {
    enabled,
    updatePolicy,
    checksumPolicy
  };
};

const readRepositoriesFromProject = project => {
  if ( !project.repositories || !project.repositories[0] || !project.repositories[0].repository ) {
    return [];
  }

  return project.repositories[0].repository.map(repository => {
    const id = repository.id ? repository.id[0] : undefined;
    const url = repository.url ? repository.url[0] : undefined;
    const name = repository.name ? repository.name[0] : undefined;
    const layout = repository.layout ? repository.layout[0] : undefined;

    let releases = undefined;
    let snapshots = undefined;

    if (repository.releases && repository.releases[0]) {
      releases = getRepositoryPolicy(repository.releases[0]);
    }
    if (repository.snapshots && repository.snapshots[0]) {
      snapshots = getRepositoryPolicy(repository.snapshots[0]);
    }

    return {
      id,
      url,
      name,
      layout,
      releases,
      snapshots
    };
  });
};

const readDependenciesFromProject = project => {
  if ( !project.dependencies || !project.dependencies[0] || !project.dependencies[0].dependency ) {
    return [];
  }

  return project.dependencies[0].dependency.map(dependency => {
    const scope = dependency.scope ? dependency.scope[0] : undefined;
    
    return {
      ...getCoordinatesFromNode(dependency),
      scope
    };
  });
};

const fetchParent = (project, configuration) => {
  if ( !project.parent || !project.parent[0] || !project.repositories || !project.repositories[0] ) {
    return emptyPromise;
  }

  const parentInformation = {
    artifactCoordinates: getCoordinatesFromNode(project.parent[0]),
    repositories: project.repositories[0].repository
  }

  return configuration.findParent(parentInformation)
  .then(results => {
    return parsePOMFromString(results, configuration)
  })
  .catch(error => {
    return emptyPromise;
  });
};

const defaultFetch = (information) => {
  const urls = assembleUrls(information);
  const requestPromises = repositoryRequests(urls);

  return Promise.all(requestPromises)
    .then(promiseResults =>
    promiseResults.filter(artifactRetrievalPromise => artifactRetrievalPromise != undefined))
      .then(validPromise => {
        if(validPromise.length > 0){
          return validPromise[0];
        }
      });
};

const assembleUrls = (information) => { 
  const coordinates = information.artifactCoordinates;
  const groupId = coordinates.groupId.split('.').join('/');
  const urls = [];

  for (let i = 0; i < information.repositories.length; i++) {
    let baseRepo = information.repositories[i].url[0];
    urls.push(
      `${baseRepo}/${groupId}/${coordinates.artifactId}/${coordinates.version}/${coordinates.artifactId}-${coordinates.version}.pom`
    );
  }
  return urls;
};

const repositoryRequests = (urls) => {
  const getPromises = []; 

  for (let i = 0; i < urls.length; i++) {
    getPromises.push(
      axios.get(urls[i])
        .then(response => response.data)
        .catch(error => {
          if (error.response.status > 399 && error.response.status < 500) {
            return emptyPromise; }
          else {
            throw new error;
          }
        })
    );
  }
  return getPromises;
};

const createConfigurationObject = (configuration) => {
  const defaultConfiguration = {
    findParent: defaultFetch
  };
  let completeConfiguration = {};

  if (configuration) {
    for(let key in defaultConfiguration) {
      completeConfiguration[key] = configuration[key] ? configuration[key] : defaultConfiguration[key];
    }
  }
  else {
    completeConfiguration = defaultConfiguration;
  }
  return completeConfiguration;
};

const buildJSONStructure = (project, configuration) => {
  let parentCoordinates = undefined;
  const parentPOMPromise = fetchParent(project, configuration);

  if (project.parent && project.parent[0]) {
    parentCoordinates = getCoordinatesFromNode(project.parent[0]);
  }

  return parentPOMPromise.then(parentPOM => {
    return {
      ...getCoordinatesFromNode(project),
      parent: parentCoordinates,
      dependencies: readDependenciesFromProject(project),
      repositories: readRepositoriesFromProject(project),
      parentPom: parentPOM
    };
  });
};

const parsePOMFromString = (pomContents, configuration) => {
  return new Promise(resolve => {
    return xml2js.parseString(pomContents, (err, result) => {
      resolve(result);
    });
  })
    .then(result => result.project)
    .then(data => buildJSONStructure(data, createConfigurationObject(configuration)));
};

module.exports = { parsePOMFromString };