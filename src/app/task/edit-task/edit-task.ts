import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../types';
import { Location } from '@angular/common';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask {
  name = '';
  description = '';

  categoryId = 0;
  task: Task | undefined
  tasks: Task[] = []
  taskService = inject(TaskService);
  private db = inject(DatabaseService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  location = inject(Location);

  async ngOnInit() {
    await this.db.init();
    this.task = await this.taskService.getTaskById(this.taskService.getTaskId());
    this.name = this.task!.name;
    this.description = this.task!.description;
  }

  save() {
    if (this.name.trim()) {
      this.taskService.editTask(this.taskService.getTaskId(), {
        name: this.name,
        completed: this.task!.completed,
        id: this.taskService.getTaskId(),
        categoryId: this.categoryService.getCategoryId(),
        description: this.description
      });
      this.router.navigate(['/taskList']);
    }
  }

  async delete() {
    this.taskService.deleteTask(this.taskService.getTaskId());
    this.tasks = await this.taskService.getTasks(this.categoryId);
    this.router.navigate(['/taskList']);
  }

  back() {
    this.location.back();
  }
}
