import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { Task } from '../../../types';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  taskService = inject(TaskService);
  private db = inject(DatabaseService);
  task: Task | undefined;

  constructor(public router: Router) { }

    async ngOnInit() {
    await this.db.init();
    await this.loadData();
  }

  async loadData(){
    const id = this.taskService.getTaskId()
    this.task = await this.taskService.getTaskById(id);
  }

  edit() {
    if (this.task) {
      this.taskService.setTaskId(this.task.id);
      this.router.navigate(['/editTask']);
    }
  }

  back() {
    this.router.navigate(['/taskList']);
  }
}
