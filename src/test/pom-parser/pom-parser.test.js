const assert = require("assert");
const fs = require("fs");
const pomParser = require("../../main/pom-parser/pom-parser");
const http = require("http");
const mock = require("mockserver");

const readFile = fileName => {
  return fs.readFileSync(`./src/test/pom-parser/data/${fileName}`, {
    encoding: "utf-8"
  });
};

describe("POMParser", () => {
  describe("parsePomFromString", () => {
    describe("Project Coordinates", () => {
      it("simple pom with groupId, artifactId, and version", () => {
        const rawContent = readFile("simple.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.groupId, "a");
          assert.equal(pomContent.artifactId, "b");
          assert.equal(pomContent.version, "1.0.0");
        });
      });

      it("simple pom without groupId, artifactId, and version", () => {
        const rawContent = readFile("no-general-info.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.groupId, undefined);
          assert.equal(pomContent.artifactId, undefined);
          assert.equal(pomContent.version, undefined);
        });
      });
    });

    describe("Project Dependencies", () => {
      it("pom with dependencies specified", () => {
        const rawContent = readFile("dependency-file.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const compileScopeDependency = pomContent.dependencies[0];
          assert.equal(compileScopeDependency.groupId, "a");
          assert.equal(compileScopeDependency.artifactId, "compileScope");
          assert.equal(compileScopeDependency.version, "2.0.0");
          assert.equal(compileScopeDependency.scope, "compile");

          const noScopeDependency = pomContent.dependencies[1];
          assert.equal(noScopeDependency.groupId, "a");
          assert.equal(noScopeDependency.artifactId, "noScope");
          assert.equal(noScopeDependency.version, "2.0.0");
          assert.equal(noScopeDependency.scope, undefined);

          const testScopeDependency = pomContent.dependencies[2];
          assert.equal(testScopeDependency.groupId, "a");
          assert.equal(testScopeDependency.artifactId, "testScope");
          assert.equal(testScopeDependency.version, "2.0.0");
          assert.equal(testScopeDependency.scope, "test");
        });
      });

      it("pom with a dependency without a version", () => {
        const rawContent = readFile("dependency-without-version.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const dependency = pomContent.dependencies[0];
          assert.equal(dependency.groupId, "Jim");
          assert.equal(dependency.artifactId, "Pam");
          assert.equal(dependency.version, undefined);
          assert.equal(dependency.scope, "Dwight");
        });
      });

      it("no dependencies specified", () => {
        const rawContent = readFile("no-dependencies.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert(pomContent.dependencies.length === 0);
        });
      });
    });

    describe("Parent Coordinates", () => {
      it("parent-pom specified", () => {
        const rawContent = readFile("parent-pom.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.parent.groupId, "a");
          assert.equal(pomContent.parent.artifactId, "b");
          assert.equal(pomContent.parent.version, "1.0.0");
        });
      });

      it("no parent-pom specified", () => {
        const rawContent = readFile("no-parent-pom.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.parent, undefined);
        });
      });
    });

    describe("Inheritance From Parent Pom", () => {
      it("Parent group id inheritance", () => {
        const rawContent = readFile("parent-group-id-inheritance.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.groupId, "a");
        });
      });

      it("Parent version inheritance", () => {
        const rawContent = readFile("parent-version-inheritance.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.equal(pomContent.version, "1.0.0");
        });
      });
    });

    describe("Project Repositories", () => {
      it("basic repo", () => {
        const rawContent = readFile("repo-basic.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const repository = pomContent.repositories[0];
          assert.equal(repository.id, "The Beatles");
          assert.equal(
            repository.url,
            "https://en.wikipedia.org/wiki/The_Beatles"
          );
          assert.equal(repository.name, undefined);
          assert.equal(repository.layout, "Pre-Yoko");

          assert.equal(repository.releases.enabled, "false");
          assert.equal(repository.releases.updatePolicy, "always");
          assert.equal(repository.releases.checksumPolicy, "warn");

          assert.equal(repository.snapshots.enabled, "true");
          assert.equal(repository.snapshots.checksumPolicy, "fail");
          assert.equal(repository.snapshots.updatePolicy, "never");
        });
      });

      it("no repo specified", () => {
        const rawContent = readFile("no-repo.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert(pomContent.repositories.length === 0);
        });
      });

      it("Repo id/url", () => {
        const rawContent = readFile("repo-id-url.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          let repository = pomContent.repositories[0];
          assert.equal(repository.id, "Trader Joes");
          assert.equal(repository.url, "https://www.traderjoes.com/");

          repository = pomContent.repositories[1];
          assert.equal(repository.id, undefined);
          assert.equal(repository.url, "https://www.walmart.com/");

          repository = pomContent.repositories[2];
          assert.equal(repository.id, "Target");
          assert.equal(repository.url, undefined);
        });
      });

      it("Repo name/layout", () => {
        const rawContent = readFile("repo-name-layout.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          let repository = pomContent.repositories[0];
          assert.equal(repository.name, "Elizabeth Bennet");
          assert.equal(repository.layout, "Regency");

          repository = pomContent.repositories[1];
          assert.equal(repository.name, "Mr. Darcy");
          assert.equal(repository.layout, undefined);

          repository = pomContent.repositories[2];
          assert.equal(repository.name, undefined);
          assert.equal(repository.layout, "Jane Austen");
        });
      });

      it("Repo releases/snapshots", () => {
        const rawContent = readFile("repo-releases-snapshots.xml");

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const repository = pomContent.repositories[0];
          assert.equal(repository.releases.enabled, "up");
          assert.equal(repository.releases.updatePolicy, "Never");
          assert.equal(repository.releases.checksumPolicy, "gunna");
          assert.equal(repository.snapshots.enabled, "let");
          assert.equal(repository.snapshots.updatePolicy, "you");
          assert.equal(repository.snapshots.checksumPolicy, "down");

          emptyRSRepository = pomContent.repositories[1];
          assert.equal(emptyRSRepository.releases.enabled, undefined);
          assert.equal(emptyRSRepository.releases.updatePolicy, undefined);
          assert.equal(emptyRSRepository.releases.checksumPolicy, undefined);
          assert.equal(emptyRSRepository.snapshots.enabled, undefined);
          assert.equal(emptyRSRepository.snapshots.updatePolicy, undefined);
          assert.equal(emptyRSRepository.snapshots.checksumPolicy, undefined);
        });
      });
    });

    describe("Recursive Parent Pom Fetching", () => {
      it("find parent pom using a user method", () => {
        const rawContent = readFile("grandchild-fetch-pom.xml");
        const configuration = {
          findParent: function(information) {
            return new Promise(resolve =>
              resolve(
                readFile(
                  `${information.artifactCoordinates.artifactId}-fetch-pom.xml`
                )
              )
            );
          }
        };

        return pomParser
          .parsePOMFromString(rawContent, configuration)
          .then(pomContent => {
            const parentPOM = pomContent.parentPom;
            assert.equal(parentPOM.groupId, "child of the overlord");
            assert.equal(parentPOM.artifactId, "child");
            assert.equal(parentPOM.version, "3.0.0");

            assert.equal(parentPOM.parent.groupId, "a");
            assert.equal(parentPOM.parent.artifactId, "parent");
            assert.equal(parentPOM.parent.version, "1.0.0");

            const grandparentPOM = parentPOM.parentPom;
            assert.equal(grandparentPOM.groupId, "a");
            assert.equal(grandparentPOM.artifactId, "parent");
            assert.equal(grandparentPOM.version, "1.0.0");
            assert.equal(grandparentPOM.parentPom, undefined);
          });
      });

      it("check parentPom holds correct values after user method", () => {
        const rawContent = readFile("grandchild-fetch-pom.xml");
        const configuration = {
          findParent: function(information) {
            return new Promise(resolve =>
              resolve(
                readFile(
                  `${information.artifactCoordinates.artifactId}-fetch-pom.xml`
                )
              )
            );
          }
        };

        return pomParser
          .parsePOMFromString(rawContent, configuration)
          .then(pomContent => {
            const parentPOM = pomContent.parentPom;
            assert.equal(parentPOM.groupId, "child of the overlord");
            assert.equal(parentPOM.artifactId, "child");
            assert.equal(parentPOM.version, "3.0.0");

            assert.equal(parentPOM.parent.groupId, "a");
            assert.equal(parentPOM.parent.artifactId, "parent");
            assert.equal(parentPOM.parent.version, "1.0.0");

            assert.equal(parentPOM.repositories[0].id, "The Beatles");
            assert.equal(
              parentPOM.repositories[0].url,
              "https://en.wikipedia.org/wiki/The_Beatles"
            );
            assert.equal(parentPOM.repositories[0].layout, "Pre-Yoko");
            assert.equal(parentPOM.repositories[0].releases.enabled, "false");
            assert.equal(
              parentPOM.repositories[0].releases.updatePolicy,
              "always"
            );
            assert.equal(
              parentPOM.repositories[0].releases.checksumPolicy,
              "warn"
            );
            assert.equal(parentPOM.repositories[0].snapshots.enabled, "true");
            assert.equal(
              parentPOM.repositories[0].snapshots.updatePolicy,
              "never"
            );
            assert.equal(
              parentPOM.repositories[0].snapshots.checksumPolicy,
              "fail"
            );

            const grandparentPOM = parentPOM.parentPom;
            assert.equal(grandparentPOM.groupId, "a");
            assert.equal(grandparentPOM.artifactId, "parent");
            assert.equal(grandparentPOM.version, "1.0.0");
            assert.equal(grandparentPOM.parentPom, undefined);
            assert(grandparentPOM.repositories.length === 0);
          });
      });

      it("find parent pom using the default fetch with a mock server", () => {
        const rawContent = readFile("default-fetch-parent.xml");
        const server = http
          .createServer(mock("./src/test/pom-parser/mocks"))
          .listen(3001);

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const parentPOM = pomContent.parentPom;
          assert.equal(parentPOM.groupId, "a");
          assert.equal(parentPOM.artifactId, "b");
          assert.equal(parentPOM.version, "2.0.0");
          assert.equal(parentPOM.parent, undefined);
          assert.equal(parentPOM.parentPom, undefined);
          server.close();
        });
      });

      it("check parentPom values after the default fetch with a mock server", () => {
        const rawContent = readFile("default-fetch-parent.xml");
        const server = http
          .createServer(mock("./src/test/pom-parser/mocks"))
          .listen(3001);

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          const parentPOM = pomContent.parentPom;
          assert(parentPOM.repositories.length === 0);

          const compileScopeDependency = parentPOM.dependencies[0];
          assert.equal(compileScopeDependency.groupId, "a");
          assert.equal(compileScopeDependency.artifactId, "compileScope");
          assert.equal(compileScopeDependency.version, "2.0.0");
          assert.equal(compileScopeDependency.scope, "compile");

          const noScopeDependency = parentPOM.dependencies[1];
          assert.equal(noScopeDependency.groupId, "b");
          assert.equal(noScopeDependency.artifactId, "noScope");
          assert.equal(noScopeDependency.version, "2.0.0");
          assert.equal(noScopeDependency.scope, undefined);

          const testScopeDependency = parentPOM.dependencies[2];
          assert.equal(testScopeDependency.groupId, "c");
          assert.equal(testScopeDependency.artifactId, "testScope");
          assert.equal(testScopeDependency.version, "2.0.0");
          assert.equal(testScopeDependency.scope, "test");

          server.close();
        });
      });

      it("check an error is thrown when all repo urls are invalid in fetchParent", () => {
        const rawContent = readFile("invalid-repo-urls.xml");
        const server = http
          .createServer(mock("./src/test/pom-parser/mocks"))
          .listen(3001);

        return pomParser.parsePOMFromString(rawContent).then(pomContent => {
          assert.throws(() => {
            throw new error();
          });
          server.close();
        });
      });
    });
  });
});
