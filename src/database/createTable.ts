import pkg from 'sqlite3';
const { verbose } = pkg;

const sqlite = verbose();
const db = new sqlite.Database('db');

db.run(`CREATE TABLE shifts (
  id TEXT PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  shift_group TEXT NOT NULL
)`);

db.run(`CREATE TABLE shiftMembers (
  id TEXT FOREIGN KEY NOT NULL,
  content TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  shift_group TEXT NOT NULL
)`);