const fs = require('fs');
const pomParser = require('../main/pom-parser/pom-parser');

const pomContents = fs.readFileSync('./data/equalsVerifierPom.xml', {encoding: 'utf8'});
pomParser.parsePOMFromString(pomContents)
  .then(console.log);