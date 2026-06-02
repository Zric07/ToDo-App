import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Task } from '../../../types';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  category: Category | undefined;
  showMenu = false;
  selectedTask: Task | null = null;
  private pressTimer: any;

  constructor(public router: Router) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const id = this.getCategoryById();
    this.category = this.categoryService.getCategoryById(id);
    await this.refreshTasks();
  }

  async refreshTasks() {
    const id = this.getCategoryById();
    const allTasks = await this.taskService.getTasks(id);

    this.tasks = [...allTasks.filter(t => t.completed === false)];
    this.completedTasks = [...allTasks.filter(t => t.completed === true)];

    this.cdr.detectChanges();
  }

  async toggle(task: Task) {
    await this.taskService.toggleTask(task.id);
    await this.refreshTasks();
  }

  edit() {
    if (this.selectedTask) {
      this.taskService.setTaskId(this.selectedTask.id);
      this.router.navigate(['/editTask']);
    }
  }

  async delete() {
    if (this.selectedTask) {
      await this.taskService.deleteTask(this.selectedTask.id);
      await this.refreshTasks();
    }
    this.closeMenu();
  }

  getCategoryById(): number {
    return this.categoryService.getCategoryId();
  }

  openForm() {
    this.router.navigate(['/taskForm']);
  }

  back() {
    this.router.navigate(['/']);
  }

  getTaskCount(categoryId: number): number {
    const tasks = this.taskService.getTasks(categoryId);
    return tasks ? tasks.length : 0;
  }

  onTouchStart(task: Task) {
    this.pressTimer = setTimeout(() => {
      this.selectedTask = task;
      this.showMenu = true;
      document.body.style.overflow = 'hidden';
    }, 1000);
  }

  onTouchEnd() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  closeMenu() {
    this.showMenu = false;
    this.selectedTask = null;
    document.body.style.overflow = '';
  }
}