const assert = require('assert');
const fs = require('fs');
const pomParser = require('../../main/pom-parser/pom-parser');

const readFile = (fileName) => {
  return fs.readFileSync(`./src/test/pom-parser/data/${fileName}`, {encoding: 'utf-8'});
}

describe('POMParser', () => {
  describe('parsePomFromString', () => {
    it('simple pom with groupId, artifactId, and version', () => {
      const rawContent = readFile('simple.xml');

      return pomParser.parsePOMFromString(rawContent)
        .then((pomContent) => {
          assert.equal(pomContent.groupId, 'a');
          assert.equal(pomContent.artifactId, 'b');
          assert.equal(pomContent.version, '1.0.0');
        });
    });

    it('pom with dependencies specified', () => {
      const rawContent = readFile('dependency-file.xml');

      return pomParser.parsePOMFromString(rawContent)
        .then((pomContent) => {
          const compileScopeDependency = pomContent.dependencies[0];
          assert.equal(compileScopeDependency.groupId, 'a');
          assert.equal(compileScopeDependency.artifactId, 'compileScope');
          assert.equal(compileScopeDependency.version, '2.0.0');
          assert.equal(compileScopeDependency.scope, 'compile');

          const noScopeDependency = pomContent.dependencies[1];
          assert.equal(noScopeDependency.groupId, 'a');
          assert.equal(noScopeDependency.artifactId, 'noScope');
          assert.equal(noScopeDependency.version, '2.0.0');
          assert.equal(noScopeDependency.scope, undefined);

          const testScopeDependency = pomContent.dependencies[2];
          assert.equal(testScopeDependency.groupId, 'a');
          assert.equal(testScopeDependency.artifactId, 'testScope');
          assert.equal(testScopeDependency.version, '2.0.0');
          assert.equal(testScopeDependency.scope, 'test');
        });
    });

    it('no dependencies specified', () => {
      const rawContent = readFile('no-dependencies.xml');

      return pomParser.parsePOMFromString(rawContent)
        .then((pomContent) => {
          assert(pomContent.dependencies.length === 0);
        });
    });
  });
});
