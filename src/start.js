import 'babel-polyfill';
import { argv } from 'yargs';
import { writeFileSync } from 'fs';
import packageJson from '../../../package.json';
import askForInfo from './ask-for-info.js';
import askForService from './ask-for-service.js';
import getFiles from './get-files.js';
import webpack from './webpack.js';

const start = async () => {
  const env = argv.env || 'dev';
  const location = argv.location || 'remote';
  const newPackageJson = packageJson.worona ? packageJson : await askForInfo({ packageJson });
  const worona = newPackageJson.worona;
  writeFileSync('package.json', JSON.stringify(newPackageJson, null, 2));
  const service = await askForService({ services: worona.services });
  await getFiles({ service, env });
  await webpack({ ...worona, env, location });
};

process.on('unhandledRejection', (err) => {
  console.log(err.stack);
  process.exit(1);
});

start();