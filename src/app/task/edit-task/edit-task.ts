import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
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
  private taskService = inject(TaskService);
  private db = inject(DatabaseService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private location = inject(Location);
  
  name = signal('');
  description = signal('');
  taskId = signal(this.taskService.getTaskId());
  isLoading = signal(true);

  async ngOnInit() {
    await this.db.init();
    const task = await this.taskService.getTaskById(this.taskId());
    if (task) {
      this.name.set(task.name);
      this.description.set(task.description || '');
    }
    this.isLoading.set(false);
  }

  async save() {
    if (this.name().trim()) {
      await this.taskService.editTask(this.taskId(), {
        name: this.name(),
        completed: false,
        id: this.taskId(),
        categoryId: this.categoryService.getCategoryId(),
        description: this.description()
      });
      this.router.navigate(['/taskList']);
    }
  }

  async delete() {
    await this.taskService.deleteTask(this.taskId());
    this.router.navigate(['/taskList']);
  }

  back() {
    this.location.back();
  }
}