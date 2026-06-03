import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Category } from '../../types';
import { Task } from '../../types';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    const isConn = await this.sqlite.isConnection('appdb', false);
    if (isConn.result) {
        this.db = await this.sqlite.retrieveConnection('appdb', false);
    } else {
        this.db = await this.sqlite.createConnection(
            'appdb',
            false,
            'no-encryption',
            1,
            false
        );
    }

    const isOpen = await this.db.isDBOpen();
    if (!isOpen.result) {
        await this.db.open();
    }

    await this.createTables();
    this.initialized = true;
}

  private async createTables(): Promise<void> {
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

  private async ensureInit(): Promise<void> {
    if (!this.initialized) {
        await this.init();
    }
}

async getCategories(): Promise<Category[]> {
    await this.ensureInit();
    const result = await this.db.query('SELECT * FROM categories;');
    return result.values ?? [];
}

async addCategory(name: string, image: string): Promise<void> {
    await this.ensureInit();
    await this.db.run(
        'INSERT INTO categories (name, image) VALUES (?, ?);',
        [name, image]
    );
}

async editCategory(id: number, name: string, image: string): Promise<void> {
    await this.ensureInit();
    await this.db.run(
        'UPDATE categories SET name = ?, image = ? WHERE id = ?;',
        [name, image, id]
    );
}

async deleteCategory(id: number): Promise<void> {
    await this.ensureInit();
    await this.db.run('DELETE FROM categories WHERE id = ?;', [id]);
}

async getTasks(categoryId: number): Promise<Task[]> {
    await this.ensureInit();
    const result = await this.db.query(
        'SELECT * FROM tasks WHERE categoryId = ?;',
        [categoryId]
    );
    return (result.values ?? []).map(t => ({ ...t, completed: t.completed === 1 }));
}

async addTask(name: string, description: string, categoryId: number): Promise<void> {
    await this.ensureInit();
    await this.db.run(
        'INSERT INTO tasks (name, description, completed, categoryId) VALUES (?, ?, 0, ?);',
        [name, description, categoryId]
    );
}

async editTask(id: number, name: string, description: string): Promise<void> {
    await this.ensureInit();
    await this.db.run(
        'UPDATE tasks SET name = ?, description = ? WHERE id = ?;',
        [name, description, id]
    );
}

async toggleTask(id: number, completed: boolean): Promise<void> {
    await this.ensureInit();
    await this.db.run(
        'UPDATE tasks SET completed = ? WHERE id = ?;',
        [completed ? 1 : 0, id]
    );
}

async deleteTask(id: number): Promise<void> {
    await this.ensureInit();
    await this.db.run('DELETE FROM tasks WHERE id = ?;', [id]);
}

async getAllTasks(): Promise<Task[]> {
    await this.ensureInit();
    const result = await this.db.query('SELECT * FROM tasks;');
    return (result.values ?? []).map(t => ({ ...t, completed: t.completed === 1 }));
}
}