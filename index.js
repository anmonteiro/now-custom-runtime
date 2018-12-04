const crypto = require('crypto');
const { createLambda } = require('@now/build-utils/lambda.js');
const rename = require('@now/build-utils/fs/rename.js');
const objectHash = require('object-hash');

exports.config = {
  maxLambdaSize: '25mb',
};

exports.analyze = ({ files, entrypoint, config }) => {
  const entrypointHash = files[entrypoint].digest;
  const objHash = objectHash(config, { algorithm: 'sha256' });
  const combinedHashes = [entrypointHash, objHash].join('');

  return crypto
    .createHash('sha256')
    .update(combinedHashes)
    .digest('hex');
};

exports.build = async ({ files, entrypoint }) => {
  const userFiles = rename(files, name =>
    name === entrypoint ? 'bootstrap' : name,
  );

  const lambda = await createLambda({
    files: userFiles,
    handler: entrypoint,
    runtime: 'provided',
  });

  return { [entrypoint]: lambda };
};
