import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  name = '';
  description = '';
  categoryId = 0;
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);
  router = inject(Router);

  async create() {
    if (this.name.trim()) {
      await this.taskService.addTask({
        name: this.name,
        completed: false,
        id: 0,
        categoryId: this.categoryService.getCategoryId(),
        description: this.description
      });
      await this.router.navigate(['/taskList']);
    }
  }

  back() {
    this.router.navigate(['/']);
  }

}
