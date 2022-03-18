import Application from './server.js';

const app = new Application();

app.serve('public');
app.partials(process.cwd() + '/views/partials');

app.run().catch((error) => {
  console.error('[ERR]: Error on startup the application.', error);
});

process.on('SIGINT', () => {
  console.log(`[LOG]: Graceefully stopping the server...`);
  app.server.close();
  process.exit();
});
