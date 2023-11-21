const fs = require('fs');

function detokn(token){
  return JSON.parse(
    fs.readFileSync('./tokens.json')
  )[token];
}

module.exports = {
  detokn
}