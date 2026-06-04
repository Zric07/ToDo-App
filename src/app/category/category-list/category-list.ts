import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Category, Task } from '../../../types';
import { Router, NavigationEnd } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categoryService = inject(CategoryService);
  taskService = inject(TaskService);
  private db = inject(DatabaseService);
  categories: Category[] = [];
  tasks: Task[] = [];
  isLoading = true;

  constructor(public router: Router) { }

  async ngOnInit() {
    await this.db.init();
    await this.loadData();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url === '/')
    ).subscribe(async () => {
      await this.loadData();
    });
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.categories = await this.getCategories();
      
      this.tasks = [];
      for (const cat of this.categories) {
        const tasks = await this.taskService.getTasks(cat.id);
        this.tasks.push(...tasks);
      }
      
    } catch (err) {
    } finally {
      this.isLoading = false;
    }
  }

  async getCategories() {
  this.categories = await this.categoryService.getCategories();
  return this.categories;
}

  edit(category: Category) {
    this.categoryService.toggleCategory(category.id);
    this.router.navigate(['/editCategory']);
  }

  openForm() {
    this.router.navigate(['/categoryForm']);
  }

  toggleCategory(id: number) {
    this.categoryService.toggleCategory(id);
    this.router.navigate(['/taskList']);
  }

  getTaskCount(categoryId: number): number {
    return this.tasks.filter(t => t.categoryId === categoryId).length;
  }
}