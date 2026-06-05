import { inject, Injectable } from '@angular/core';
import { Task } from '../../types';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private db = inject(DatabaseService);
  private selectedTaskId = 0;

  getTasks(categoryId: number): Promise<Task[]> {
    return this.db.getTasks(categoryId);
  }

  addTask(task: Task): Promise<void> {
    return this.db.addTask(task.name, task.description, task.categoryId, task.daily);
}

  editTask(id: number, task: Task): Promise<void> {
    return this.db.editTask(id, task.name, task.description);
  }

  deleteTask(id: number): Promise<void> {
    return this.db.deleteTask(id);
  }

  toggleTask(id: number): Promise<void> {
    return this.db.getAllTasks().then(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) return this.db.toggleTask(id, !task.completed);
      return;
    });
  }

  setTaskId(id: number): void {
    this.selectedTaskId = id;
  }

  getTaskId(): number {
    return this.selectedTaskId;
  }

  getTaskById(id: number): Promise<Task | undefined> {
    return this.db.getAllTasks().then(tasks => tasks.find(t => t.id === id));
  }
}