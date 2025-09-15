import newman from 'newman';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Lấy __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Danh sách collections và environment tương ứng cần chạy
const collectionConfigs = [
  // Config collection cua Chau
  {
    col: './api-test/collections/pro-shop.postman_collection.json',
    env: './api-test/environments/pro-shop.postman_environment.json',
  },
  // Moi nguoi them config cua rieng tung nguoi vao day nhu format tren cua Chau
];

// Hàm chạy từng collection
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
