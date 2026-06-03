import express from 'express';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
let db: any;

// データベースの初期化関数
async function initDatabase() {
  // データベースファイルを開く（なければ自動生成）
  db = await open({
    filename: './shift_management.db',
    driver: sqlite3.Database
  });

  // シフトテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL,
      group_id INTEGER NOT NULL
    );
  `);

  // メンバー割り当てテーブルの作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS shift_assignments (
      shift_id TEXT,
      member_name TEXT,
      PRIMARY KEY (shift_id, member_name),
      FOREIGN KEY (shift_id) REFERENCES shifts(id)
    );
  `);

  console.log("Database initialized successfully.");
}

// --- API エンドポイント ---

// 1. 特定ユーザーのシフトを抽出する (GET /api/shifts?user=ナナフシ)
app.get('/api/shifts', async (req, res) => {
  const user = req.query.user as string;
  if (!user) return res.status(400).json({ error: "User is required" });

  try {
    const query = `
      SELECT s.id, s.start, s.end, s.content, s.type, s.group_id as 'group'
      FROM shifts s
      JOIN shift_assignments a ON s.id = a.shift_id
      WHERE a.member_name = ?
    `;
    
    // SQL実行（プレースホルダで安全にバインド）
    const rows = await db.all(query, [user]);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 新しいシフトを登録する (POST /api/shifts)
app.post('/api/shifts', async (req, res) => {
  const { id, start, end, content, type, group, members } = req.body;

  try {
    // トランザクションの開始（C++での一連の不可分処理）
    await db.exec('BEGIN TRANSACTION');

    await db.run(
      "INSERT INTO shifts (id, start, end, content, type, group_id) VALUES (?, ?, ?, ?, ?, ?)",
      [id, start, end, content, type, group]
    );

    for (const member of members) {
      await db.run(
        "INSERT INTO shift_assignments (shift_id, member_name) VALUES (?, ?)",
        [id, member]
      );
    }

    await db.exec('COMMIT');
    res.json({ success: true });
  } catch (error: any) {
    await db.exec('ROLLBACK'); // エラー時はロールバック
    res.status(500).json({ error: error.message });
  }
});

// サーバー起動
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});