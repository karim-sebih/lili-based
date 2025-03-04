import Database from 'libsql';

const db = new Database('mydb.db');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255))`);

export default db;
