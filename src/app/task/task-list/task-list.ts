import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Task } from '../../../types';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';
import { CategoryService } from '../../services/category-service';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);
  private db = inject(DatabaseService);
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  category: Category | undefined;
  showMenu = false;
  selectedTask: Task | null = null;
  private pressTimer: any;

  constructor(public router: Router) { }

  async ngOnInit() {
    await this.db.init();
    await this.loadData();
  }

  async loadData() {
    const id = this.getCategoryById();
    this.category = await this.categoryService.getCategoryById(id);
    await this.refreshTasks();
  }

  async refreshTasks() {
    const id = this.getCategoryById();
    const allTasks = await this.taskService.getTasks(id);

    this.tasks = [...allTasks.filter(t => t.completed === false)];
    this.completedTasks = [...allTasks.filter(t => t.completed === true)];

  }

  async toggle(task: Task) {
    await this.taskService.toggleTask(task.id);
    await this.refreshTasks();
  }

  edit() {
    if (this.selectedTask) {
        this.taskService.setTaskId(this.selectedTask.id);
        this.closeMenu();
        this.router.navigate(['/editTask']);
    }
}

  async delete() {
    if (this.selectedTask) {
      await this.taskService.deleteTask(this.selectedTask.id);
       this.closeMenu();
        await this.refreshTasks();
    }
  }

  getCategoryById(): number {
    return this.categoryService.getCategoryId();
  }

  openForm() {
    this.router.navigate(['/taskForm']);
  }

  openTask(id: number){
    this.taskService.setTaskId(id);
    this.router.navigate(['taskItem']);
  }

  back() {
    this.router.navigate(['/']);
  }

  getTaskCount(categoryId: number): number {
    return this.tasks.filter(t => t.categoryId === categoryId).length 
         + this.completedTasks.filter(t => t.categoryId === categoryId).length;
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