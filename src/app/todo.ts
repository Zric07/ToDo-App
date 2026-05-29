import { Injectable } from '@angular/core';
import { Todo } from '../types';
import { DatabaseService } from './database';


@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [];
  private nextId = 1;

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

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }
}
