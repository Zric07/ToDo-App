import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { Task } from '../../../types';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  taskService = inject(TaskService);
  task: Task | undefined;

  constructor(public router: Router) { }

    async ngOnInit() {
    await this.loadData();
  }

  loadData(){
    const id = this.taskService.getTaskId()
    this.task = this.taskService.getTaskById(id);
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
