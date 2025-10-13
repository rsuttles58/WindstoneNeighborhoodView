const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    await db.query(schema);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

