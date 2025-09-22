import newman from "newman";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const collectionPath = path.resolve(
  __dirname,
  "../api-test/collections/Proshop.postman_collection.json",
);
const environmentPath = path.resolve(
  __dirname,
  "../api-test/environments/Proshop Env.postman_environment.json",
);

newman.run(
  {
    collection: JSON.parse(fs.readFileSync(collectionPath)),
    environment: JSON.parse(fs.readFileSync(environmentPath)),
    reporters: ["cli", "htmlextra"],
    reporter: {
      htmlextra: {
        export: `./api-test/reports/${path.basename(
          "./api-test/collections/Proshop.postman_collection.json",
          ".json",
        )}_report.html`,
      },
    },
  },
  function (err) {
    if (err) {
      throw err;
    }
    console.log(`✅ Completed running`);
  },
);
