import dotenv from 'dotenv';
import { diContainer } from './di/di.config';
// tslint:disable-next-line:ordered-imports
import { bootstrap } from './di/bootstrap';
import { TYPES } from './di/types';
import { checkInfrastructureInitialization } from './infrastructure/di/di.config';
dotenv.config();

async function runApp() {
  const expressApp = bootstrap(diContainer);

  await checkInfrastructureInitialization();

  return Promise.all([expressApp]);
}

(async () => {
  try {
    await runApp();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

export { runApp };