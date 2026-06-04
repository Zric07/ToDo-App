import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  private taskService = inject(TaskService);
  private db = inject(DatabaseService);
  private router = inject(Router);
  
  task = signal<any>(undefined);

  async ngOnInit() {
    await this.db.init();
    await this.loadData();
  }

  async loadData() {
    const id = this.taskService.getTaskId();
    this.task.set(await this.taskService.getTaskById(id));
  }

  edit() {
    if (this.task()) {
      this.taskService.setTaskId(this.task()!.id);
      this.router.navigate(['/editTask']);
    }
  }

  back() {
    this.router.navigate(['/taskList']);
  }
}