const crypto = require('crypto');

const config = {
  iterations: 100000,
  hashBytes: 32,
  digest: 'sha512',
};

const hash = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const { iterations, hashBytes, digest } = config;
  const promise = new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      hashBytes,
      digest,
      (err, drivedkey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ salt: salt, password: drivedkey.toString('hex') });
      },
    );
  });
  return promise;
};

module.exports = hash;
