// services/db.ts
import * as SQLite from "expo-sqlite";

// Экземпляр базы данных
let db: SQLite.SQLiteDatabase | null = null;

// Тип нового нарушения
export type ViolationInput = {
  description: string;
  category: string;
  photo_base64: string;
  date_time: string;
  photo_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

// Инициализация базы
export const initDB = async (): Promise<void> => {
  try {
    if (!db) {
      db = await SQLite.openDatabaseAsync("violations.db");
    }

    // Создаём базовую таблицу (если не существует)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        category TEXT,
        photo_base64 TEXT,
        date_time TEXT
      );
    `);

    // Функция для добавления колонки, если её нет
    const addColumnIfNotExists = async (column: string, type: string) => {
      try {
        await db!.execAsync(`ALTER TABLE violations ADD COLUMN ${column} ${type};`);
      } catch (err: any) {
        if (!err.message.includes("duplicate column name")) {
          throw err;
        }
      }
    };

    // Добавляем новые колонки безопасно
    await addColumnIfNotExists("photo_url", "TEXT");
    await addColumnIfNotExists("latitude", "REAL");
    await addColumnIfNotExists("longitude", "REAL");

  } catch (err) {
    console.error("Ошибка инициализации базы:", err);
    throw err;
  }
};

// Добавить нарушение
export const addViolation = async (payload: ViolationInput): Promise<number> => {
  try {
    if (!db) throw new Error("База данных не инициализирована");

    const result = await db.runAsync(
      `INSERT INTO violations 
        (description, category, photo_base64, photo_url, latitude, longitude, date_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.description,
        payload.category,
        payload.photo_base64,
        payload.photo_url ?? null,
        payload.latitude ?? null,
        payload.longitude ?? null,
        payload.date_time,
      ]
    );

    return result.lastInsertRowId!;
  } catch (err) {
    console.error("Ошибка при добавлении нарушения:", err);
    throw err;
  }
};

// Получить все нарушения
export const getAllViolations = async (): Promise<any[]> => {
  try {
    if (!db) throw new Error("База данных не инициализирована");

    const rows = await db.getAllAsync<any>(`SELECT * FROM violations`);
    return rows;
  } catch (err) {
    console.error("Ошибка при выборке нарушений:", err);
    throw err;
  }
};

export default db;
