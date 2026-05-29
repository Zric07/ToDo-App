import { Injectable } from '@angular/core';
import { Todo } from '../types';
import { DatabaseService } from './database';


@Injectable({
  providedIn: 'root',
})
export class TodoService {

  constructor(private db: DatabaseService) {}

  async getTodos(): Promise<Todo[]> {
    const data = await this.db.getAll();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      completed: item.completed === 1
    }));
  }

  async addTodo(todo: Todo): Promise<void> {
    await this.db.add(todo.name);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.db.delete(id);
  }

  async toggleTodo(id: number): Promise<void> {
    const todos = await this.getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await this.db.toggle(id, !todo.completed);
    }
  }
}
