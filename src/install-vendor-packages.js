import { spawn } from 'child-process-promise';
import { gt } from 'semver';
import { getPackageVersion } from './utils';

export default async ({ service, packageJson }) => {
  const remoteVersion = await getPackageVersion(`core-${service}-worona`);
  const localVersion = packageJson.devDependencies[`core-${service}-worona`] || '0.0.0';
  if (gt(remoteVersion, localVersion)) {
    console.log(`\nThere is a new version of core-${service}-worona. Updating...`);
    await spawn('npm', ['install', '--save-dev', '--save-exact', `core-${service}-worona@${remoteVersion}`],
      { stdio: 'inherit' });
    console.log(`Updating finished.\n`);
  }
};