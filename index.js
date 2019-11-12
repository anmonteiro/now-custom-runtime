const crypto = require('crypto');
const { createLambda } = require('@now/build-utils/lambda.js');
const rename = require('@now/build-utils/fs/rename.js');
const objectHash = require('object-hash');

exports.version = 3;

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
  // Set the executable bit for the entrypoint. Somewhere around Now
  // v16.{2,3}.x they stopped keeping the permissions for files uploaded via
  // the CLI on deployments.
  files[entrypoint].mode |= 0o111;

  const userFiles = rename(files, name =>
    name === entrypoint ? 'bootstrap' : name,
  );

  const lambda = await createLambda({
    files: userFiles,
    handler: entrypoint,
    runtime: 'provided',
  });

  return { output: lambda };
};
