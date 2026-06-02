import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../types';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-task',
  imports: [FormsModule, MatIconModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask {
  name = '';
  description = '';

  categoryId = 0;
  task: Task | undefined
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  location = inject(Location);

  async ngOnInit() {
    this.task = this.taskService.getTaskById(this.taskService.getTaskId());
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

  back() {
    this.location.back();
  }
}
