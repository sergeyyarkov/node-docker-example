import fs from 'node:fs';
import db from './db.js';

async function run() {
  const { client } = db;
  client.connect();

  const query = fs.readFileSync('sql/schema_init.sql').toString();

  await client.query(query);
  console.log(`SQL: ${query}`);
  await client.end();
}

await run();
