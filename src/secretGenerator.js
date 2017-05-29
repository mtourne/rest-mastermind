'use strict';

class SecretGenerator {
  generateWithLength(length) {
    var digits = [];
    while (length > 0) {
      var rand = Math.floor(Math.random() * 10)
      if (rand <= 0 || rand > 6) {
        continue
      }
      digits.push(rand);
      length = length - 1;
    }
    var res = digits.join('');
    console.log(res)
    return res
  }
}

module.exports = SecretGenerator;
