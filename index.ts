import {Lambda, rename} from '@vercel/build-utils';
import crypto from 'crypto';
import objectHash from 'object-hash';
import type {BuildOptions} from '@vercel/build-utils';

exports.version = 3;

exports.analyze = ({files, entrypoint, config}: BuildOptions) => {
  // @ts-expect-error
  const entrypointHash = files[entrypoint].digest;
  const objHash = objectHash(config, {algorithm : 'sha1'});
  const combinedHashes = [ entrypointHash, objHash ].join('');

  return crypto.createHash('sha256').update(combinedHashes).digest('hex');
};

exports.build = async ({files, entrypoint}: BuildOptions) => {
  // Set the executable bit for the entrypoint. Somewhere around Now
  // v16.{2,3}.x they stopped keeping the permissions for files uploaded via
  // the CLI on deployments.
  files[entrypoint].mode |= 0o111;

  const userFiles = rename(
      files,
      name => name === entrypoint ? 'bootstrap' : name,
  );

  const lambda = new Lambda({
    files : userFiles,
    handler : entrypoint,
    runtime : 'provided',
  });

  return {output : lambda};
};
