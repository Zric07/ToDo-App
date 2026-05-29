import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;

  async init() {
    if (this.db) return;
    
    this.db = await this.sqlite.createConnection(
      'todo_db',         
      false,              
      'no-encryption',    
      1,                  
      false               
    );
    
    await this.db.open();
    
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);
  }

  async getAll() {
    await this.init();
    const result = await this.db!.query('SELECT * FROM todos');
    return result.values || [];
  }

  async add(name: string) {
    await this.init();
    await this.db!.run('INSERT INTO todos (name) VALUES (?)', [name]);
  }

  async toggle(id: number, completed: boolean) {
    await this.init();
    await this.db!.run('UPDATE todos SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
  }

  async delete(id: number) {
    await this.init();
    await this.db!.run('DELETE FROM todos WHERE id = ?', [id]);
  }
}