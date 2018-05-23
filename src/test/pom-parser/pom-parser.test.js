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
  });
});