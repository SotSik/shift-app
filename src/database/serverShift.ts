import express from 'express';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
let db;

// データベースの初期化関数
async function initDatabase() {
  // データベースファイルを開く（なければ自動生成）
  db = await open({
    filename: './shift_manage.db',
    driver: sqlite3.Database
  });

  // シフトテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      content TEXT NOT NULL,
      group_id INTEGER NOT NULL
    );
  `);

  // メンバー割り当てテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shiftMembers (
      id TEXT,
      name TEXT,
      PRIMARY KEY (id, name),
      FOREIGN KEY (id) REFERENCES shifts(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS groupInfo (
      id INTEGER PRIMARY KEY,
      content TEXT
    );
  `);
  console.log("Database initialized successfully.");
}

// --- API エンドポイント ---

app.get("/api/shifts/all", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM shifts");
    const members = await db.all("SELECT * FROM shiftMembers");
    const group = await db.all("SELECT * FROM groupInfo");
    res.json({ rows: rows, members: members, group: group });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
});

app.post('/api/shifts/register', async (req, res) => {
  try {
    const dataArray = req.body.shift || [];
    // forEachではなくfor...ofで非同期処理を確実に待機
    for (const row of dataArray) {
      await db.run(
        "INSERT OR REPLACE INTO shifts (id, start, end, content, group_id) VALUES (?, ?, ?, ?, ?)",
        [row.id, row.start, row.end, row.content, row.group_id]
      );
    }
  } catch (error: any) {
    console.error("【/api/shifts/register でSQLエラー発生】:", error);
  }
  try {
    const dataArray = req.body.group || [];
    // forEachではなくfor...ofで非同期処理を確実に待機
    for (const row of dataArray) {
      await db.run(
        "INSERT OR REPLACE INTO groupInfo (id, content) VALUES (?, ?)",
        [row.id, row.content]
      );
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("【/api/shifts/register でSQLエラー発生】:", error);
    res.status(500).json({ error: error });
  }
});

app.post('/api/shifts/registerMember', async (req, res) => {
  try {
    // 送られてくるJSONの構造に合わせて適切な配列（例: req.body.membersなど）を指定してください
    const dataArray = Array.isArray(req.body) ? req.body : (req.body.members || []);
    
    for (const row of dataArray) {
      await db.run(
        "INSERT OR REPLACE INTO shiftMembers (id, name) VALUES (?, ?)",
        [row.id, row.name]
      );
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("【/api/shifts/register でSQLエラー発生】:", error);
    res.status(500).json({ error: error });
  }
});

app.post('/api/shifts/update', async (req, res) => {
  try {
    const { id, start, end, content, group_id } = req.body;
    await db.run(
      "UPDATE shifts SET start = ?, end = ?, content = ?, group_id = ? WHERE id = ?",
      [ start, end, content, group_id, id]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
});

// サーバー起動
async function startApplication() {
  try {
    // 1. データベースの初期化を完全に完了させる
    await initDatabase();
    console.log("Database initialized successfully.");
    // 3. Expressサーバーを起動（このリスナーがプロセスを維持します）
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // プロセスが勝手に終了するのを防ぐためのシグナルハンドラ
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server process terminated.');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

startApplication();