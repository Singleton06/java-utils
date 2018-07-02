const fs = require('fs');
const pomParser = require('../main/pom-parser/pom-parser');

const pomContents = fs.readFileSync('./data/grandchild-fetch-pom.xml', { encoding: 'utf8' });
const config = {
  findParent: function(information) {
    return new Promise(resolve => 
      resolve(fs.readFileSync(`./data/${information.artifactCoordinates.artifactId}-fetch-pom.xml`,{ encoding: 'utf8' }))
    )
  }
}; 
pomParser.parsePOMFromString(pomContents, config)
.then(console.log);
