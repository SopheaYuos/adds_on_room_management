// Password will never be redundance
const bcrypt = require('bcrypt');
const saltRounds = 12;
module.exports = {
   encryptPass: encryptPass,
   decryptPass: decryptPass
}
function encryptPass(myPlaintextPassword) {
   const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
   return hash;
}

function decryptPass(hash, myPlaintextPassword) {
   // Load hash from your password DB.
   const result = bcrypt.compareSync(myPlaintextPassword, hash);
   console.log(result)
   return result;

}
