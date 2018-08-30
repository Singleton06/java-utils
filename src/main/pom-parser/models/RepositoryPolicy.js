/**
 * Represents the download policy that is used for the repository.  Generally this will either represent a snapshots or
 * releases node within a repository node on a POM document.
 *
 * @property {string} enabled
 *    Whether to use this repository for downloading this type of artifact. This value can be <code>true</code> or
 *    <code>false</code>.
 * @property {string} updatePolicy
 *    The frequency for downloading updates - can be <code>always,</code> <code>daily</code> (default),
 *    <code>interval:XXX</code> (in minutes) or <code>never</code> (only if it doesn't exist locally).
 * @property {string} checksumPolicy
 *    What to do when verification of an artifact checksum fails. Valid values are <code>ignore</code> ,
 *    <code>fail</code> or <code>warn</code> (the default).
 *
 * @author Dustin Singleton
 */
class RepositoryPolicy {

  /**
   * Constructs a new instance of the RepositoryPolicy object.
   *
   * @param repositoryPolicy
   *    The download policy used for a repository.
   *
   * @param {string} repositoryPolicy.enabled
   *    Whether to use this repository for downloading this type of artifact. This value can be <code>true</code> or
   *    <code>false</code>.
   * @param {string} repositoryPolicy.updatePolicy
   *    The frequency for downloading updates - can be <code>always,</code> <code>daily</code> (default),
   *    <code>interval:XXX</code> (in minutes) or <code>never</code> (only if it doesn't exist locally).
   * @param {string} repositoryPolicy.checksumPolicy
   *    What to do when verification of an artifact checksum fails. Valid values are <code>ignore</code> ,
   *    <code>fail</code> or <code>warn</code> (the default).
   */
  constructor(repositoryPolicy) {
    this.enabled = repositoryPolicy.enabled;
    this.updatePolicy = repositoryPolicy.updatePolicy;
    this.checksumPolicy = repositoryPolicy.checksumPolicy;
  }
}

module.exports = {
  RepositoryPolicy
};