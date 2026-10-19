import { createApp } from './app';
import { config } from './config';
import { db } from './db';
import { seedIfEmpty } from './seed';

seedIfEmpty(db);

const app = createApp();
const server = app.listen(config.port, () => {
  console.log(`\n  ResQChain API listening on http://localhost:${config.port}  (${config.isProduction ? 'production' : 'development'})`);
  console.log(`  Database: ${config.dbPath}\n`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
