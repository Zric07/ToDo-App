import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Category, Task } from '../../types';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized && this.db !== null) {
      return;
    }

    try {
      const dbName = 'appdb';
      const isConn = await this.sqlite.isConnection(dbName, false);
      
      if (isConn && isConn.result) {
        this.db = await this.sqlite.retrieveConnection(dbName, false);
      } else {
        this.db = await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);
      }

      if (this.db === null) {
        throw new Error('Failed to create or retrieve database connection');
      }

      const isOpen = await this.db.isDBOpen();
      if (!isOpen || !isOpen.result) {
        await this.db.open();
      }

      await this.ensureTables();
      this.initialized = true;
    } catch (err) {
      this.initialized = false;
      this.db = null;
      throw err;
    }
  }

  private async ensureTables(): Promise<void> {
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT
      );
    `);
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);
  }

  async getCategories(): Promise<Category[]> {
    await this.init();
    if (this.db === null) {
      return [];
    }
    const result = await this.db.query('SELECT * FROM categories ORDER BY id DESC;');
    return result.values ?? [];
  }

  async addCategory(name: string, image: string): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('INSERT INTO categories (name, image) VALUES (?, ?);', [name, image]);
  }

  async editCategory(id: number, name: string, image: string): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('UPDATE categories SET name = ?, image = ? WHERE id = ?;', [name, image, id]);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('DELETE FROM categories WHERE id = ?;', [id]);
  }

  async getTasks(categoryId: number): Promise<Task[]> {
    await this.init();
    if (this.db === null) {
      return [];
    }
    const result = await this.db.query('SELECT * FROM tasks WHERE categoryId = ? ORDER BY id DESC;', [categoryId]);
    return (result.values ?? []).map(t => ({ ...t, completed: t.completed === 1 }));
  }

  async addTask(name: string, description: string, categoryId: number): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('INSERT INTO tasks (name, description, completed, categoryId) VALUES (?, ?, 0, ?);', [name, description, categoryId]);
  }

  async editTask(id: number, name: string, description: string): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('UPDATE tasks SET name = ?, description = ? WHERE id = ?;', [name, description, id]);
  }

  async toggleTask(id: number, completed: boolean): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('UPDATE tasks SET completed = ? WHERE id = ?;', [completed ? 1 : 0, id]);
  }

  async deleteTask(id: number): Promise<void> {
    await this.init();
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    await this.db.run('DELETE FROM tasks WHERE id = ?;', [id]);
  }

  async getAllTasks(): Promise<Task[]> {
    await this.init();
    if (this.db === null) {
      return [];
    }
    const result = await this.db.query('SELECT * FROM tasks ORDER BY id DESC;');
    return (result.values ?? []).map(t => ({ ...t, completed: t.completed === 1 }));
  }
}