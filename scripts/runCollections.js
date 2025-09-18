import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const collectionConfigs = [
  {
    col: './api-test/collections/pro-shop.postman_collection.json',
    env: './api-test/environments/pro-shop.postman_environment.json',
  },
  {
    col: './api-test/collections/signup_login_logout.postman_collection.json',
    env: './api-test/environments/signup_login_logout.postman_environment.json',
  },
  {
     col: './api-test/collections/usersAPI_Admin token.postman_collection.json',
     env: './api-test/environments/usersAPI.postman_environment.json',
},
{
     col: './api-test/collections/usersAPI_Non-Admin token.postman_collection.json',
     env: './api-test/environments/usersAPI.postman_environment.json',
}
{
     col: './api-test/collections/usersAPI_Missing token.postman_collection.json',
     env: './api-test/environments/usersAPI.postman_environment.json',
}
];

collectionConfigs.forEach((config) => {
  const collectionPath = path.resolve(__dirname, '..', config.col);
  const environmentPath = path.resolve(__dirname, '..', config.env);

  newman.run(
    {
      collection: JSON.parse(fs.readFileSync(collectionPath)),
      environment: JSON.parse(fs.readFileSync(environmentPath)),
      reporters: ['cli', 'htmlextra'],
      reporter: {
        htmlextra: {
          export: `./api-test/reports/${path.basename(
            config.col,
            '.json'
          )}_report.html`,
        },
      },
    },
    function (err) {
      if (err) {
        throw err;
      }
      console.log(`✅ Completed running: ${config.col}`);
    }
  );
});
