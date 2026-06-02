import { Injectable } from '@angular/core';
import { Task } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;
  private selectedTaskId = 0;

  getTasks(categoryId: number): Task[] {
  return this.tasks.filter(t => t.categoryId === categoryId);
}

  addTask(task: Task): void {
    task.id = this.nextId++;
    this.tasks.push(task);
  }

  editTask(id: number, task: Task): void{
    const index = this.tasks.findIndex(c => c.id === id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
  }

  setTaskId(id: number): void {
    this.selectedTaskId = id;
  }

  getTaskId(): number{
      return this.selectedTaskId;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(c => c.id === id);
  }
}