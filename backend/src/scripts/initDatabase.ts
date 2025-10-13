import fs from 'fs';
import path from 'path';
import { query, pool } from '../config/database';

async function initDatabase(): Promise<void> {
  try {
    console.log('Initializing database...');

    const schema = fs.readFileSync(
      path.join(__dirname, '../../scripts/schema.sql'),
      'utf8'
    );

    await query(schema);

    console.log('Database initialized successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
