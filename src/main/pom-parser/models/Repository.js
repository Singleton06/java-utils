const RepositoryPolicy = require('../models');

/**
 * A repository contains the information needed for establishing connections with remote repository.
 *
 * @property {string} id
 *    A unique identifier for a repository. This is used to match the repository to configuration in the
 *    <code>settings.xml</code> file, for example. Furthermore, the identifier is used during POM inheritance and
 *    profile injection to detect repositories that should be merged.
 * @property {string} url
 *    The url of the repository, in the form <code>protocol://hostname/path</code>.
 * @property {string} name
 *    Human readable name of the repository.
 * @property {string} layout
 *    The type of layout this repository uses for locating and storing artifacts - can be <code>legacy</code> for
 *    maven 1.x or <code>default</code> for other versions of maven.
 * @property {RepositoryPolicy} releases
 *    How to handle downloading of releases from this repository.
 * @property {RepositoryPolicy} snapshots
 *    How to handle downloading of snapshots from this repository.
 * 
 * @author Dustin Singleton
 */
class Repository {

  /**
   * Constructor for creating repository objects.
   *
   * @param repository
   *    The object containing the information needed for establishing connections with remote repository.
   *
   * @param {string} repository.id
   *    A unique identifier for a repository. This is used to match the repository to configuration in the
   *    <code>settings.xml</code> file, for example. Furthermore, the identifier is used during POM inheritance and
   *    profile injection to detect repositories that should be merged.
   * @param {string} repository.url
   *    The url of the repository, in the form <code>protocol://hostname/path</code>.
   * @param {string} repository.name
   *    Human readable name of the repository.
   * @param {string} repository.layout
   *    The type of layout this repository uses for locating and storing artifacts - can be <code>legacy</code> for
   *    maven 1.x or <code>default</code> for other versions of maven.
   * @param {RepositoryPolicy} repository.releases
   *    How to handle downloading of releases from this repository.
   * @param {RepositoryPolicy} repository.snapshots
   *    How to handle downloading of snapshots from this repository.
   */
  constructor (repository){
    this.id = repository.id;
    this.url = repository.url;
    this.name = repository.name;
    this.layout = repository.layout;
    this.releases = repository.releases;
    this.snapshots = repository.snapshots;
  }
}

module.exports = {
  Repository
};
