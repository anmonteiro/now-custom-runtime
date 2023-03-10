import {Lambda, rename} from '@vercel/build-utils';
import type {BuildOptions} from '@vercel/build-utils';

export const version = 3;

export function build({files, entrypoint}: BuildOptions) {
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
