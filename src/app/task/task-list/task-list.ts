import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Task } from '../../../types';
import { CommonModule } from '@angular/common';
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
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);
  private db = inject(DatabaseService);
  private router = inject(Router);
  
  tasks = signal<Task[]>([]);
  completedTasks = signal<Task[]>([]);
  category = signal<Category | undefined>(undefined);
  isLoading = signal(true);
  
  showMenu = signal(false);
  selectedTask = signal<Task | null>(null);
  private pressTimer: any;

  async ngOnInit() {
    await this.db.init();
    await this.loadData();
  }

  private getCategoryId(): number {
    return this.categoryService.getCategoryId();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const id = this.getCategoryId();
      this.category.set(await this.categoryService.getCategoryById(id));
      await this.refreshTasks();
    } finally {
      this.isLoading.set(false);
    }
  }

  async refreshTasks() {
    const id = this.getCategoryId();
    const allTasks = await this.taskService.getTasks(id);
    this.tasks.set(allTasks.filter(t => !t.completed));
    this.completedTasks.set(allTasks.filter(t => t.completed));
  }

  async toggle(task: Task) {
    await this.taskService.toggleTask(task.id);
    await this.refreshTasks();
  }

  edit() {
    if (this.selectedTask()) {
      this.taskService.setTaskId(this.selectedTask()!.id);
      this.closeMenu();
      this.router.navigate(['/editTask']);
    }
  }

  async delete() {
    if (this.selectedTask()) {
      await this.taskService.deleteTask(this.selectedTask()!.id);
      this.closeMenu();
      await this.refreshTasks();
    }
  }

  openForm() {
    this.router.navigate(['/taskForm']);
  }

  openTask(id: number) {
    this.taskService.setTaskId(id);
    this.router.navigate(['taskItem']);
  }

  back() {
    this.router.navigate(['/']);
  }

  getTaskCount(categoryId: number): number {
    return this.tasks().filter(t => t.categoryId === categoryId).length + 
           this.completedTasks().filter(t => t.categoryId === categoryId).length;
  }

  onTouchStart(task: Task) {
    this.pressTimer = setTimeout(() => {
      this.selectedTask.set(task);
      this.showMenu.set(true);
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
    this.showMenu.set(false);
    this.selectedTask.set(null);
    document.body.style.overflow = '';
  }
}