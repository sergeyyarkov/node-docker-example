import fs from 'node:fs';
import path from 'node:path';
import Application from './server.js';
import FileHelper from './helpers/file.js';

const app = new Application();

app.serve('public');

{
  const partials = FileHelper.readDirRecursive(
    process.cwd() + '/views/partials'
  );

  /**
   * Register partials from files
   */
  for (const partial of partials) {
    const fileName = path.basename(partial);
    app.hbs.registerPartial(
      path.parse(fileName).name,
      fs.readFileSync(partial, 'utf8').toString()
    );
  }
}

app.run().catch((error) => {
  console.error('[ERR]: Error on startup the application.', error);
});

process.on('SIGINT', () => {
  console.log(`[LOG]: Graceefully stopping the server...`);
  app.server.close();
  process.exit();
});
