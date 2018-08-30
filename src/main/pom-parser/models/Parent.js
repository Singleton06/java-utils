/**
 * The <code>&lt;parent&gt;</code> element contains information required to locate the parent project from which
 * this project will inherit from. <strong>Note:</strong> The children of this element are not interpolated and
 * must be given as literal values.
 *
 * @property groupId
 *      The group id of the parent project to inherit from.
 * @property artifactId
 *      The artifact id of the parent project to inherit from.
 * @property version
 *      The version of the parent project to inherit.
 * @property relativePath
 *      The relative path of the parent <code>pom.xml</code> file within the check out. If not specified, it defaults
 *      to <code>../pom.xml</code>. Maven looks for the parent POM first in this location on the filesystem, then the
 *      local repository, and lastly in the remote repo. <code>relativePath</code> allows you to select a different
 *      location, for example when your structure is flat, or deeper without an intermediate parent POM. However, the
 *      group ID, artifact ID and version are still required, and must match the file in the location given or it will
 *      revert to the repository for the POM. This feature is only for enhancing the development in a local checkout
 *      of that project. Set the value to an empty string in case you want to disable the feature and always resolve
 *      the parent POM from the repositories.
 */
class Parent {
  /**
   * Constructs a new instance of a Parent.  This class is used to represent the project that this pom will inherit
   * from.
   *
   * @param parent
   *      The <code>&lt;parent&gt;</code> element contains information required to locate the parent project from which
   *      this project will inherit from. <strong>Note:</strong> The children of this element are not interpolated and
   *      must be given as literal values.
   *
   * @param parent.groupId
   *      The group id of the parent project to inherit from.
   * @param parent.artifactId
   *      The artifact id of the parent project to inherit from.
   * @param parent.version
   *      The version of the parent project to inherit.
   * @param parent.relativePath
   *      The relative path of the parent <code>pom.xml</code> file within the check out. If not specified, it defaults
   *      to <code>../pom.xml</code>. Maven looks for the parent POM first in this location on the filesystem, then the
   *      local repository, and lastly in the remote repo. <code>relativePath</code> allows you to select a different
   *      location, for example when your structure is flat, or deeper without an intermediate parent POM. However, the
   *      group ID, artifact ID and version are still required, and must match the file in the location given or it will
   *      revert to the repository for the POM. This feature is only for enhancing the development in a local checkout
   *      of that project. Set the value to an empty string in case you want to disable the feature and always resolve
   *      the parent POM from the repositories.
   */
  constructor(parent) {
    this.groupId = parent.groupId;
    this.artifactId = parent.artifactId;
    this.version = parent.version;
    this.relativePath = parent.relativePath;
  }
}

module.exports = {
  Parent
};