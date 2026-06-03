import { Component, inject, OnInit } from '@angular/core';
import { Category, Task } from '../../../types';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [MatIconModule, CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categoryService = inject(CategoryService);
  taskService = inject(TaskService);
  categories: Category[] = [];
  tasks: Task[] = [];
  isLoading = true;

  constructor(public router: Router) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    this.categories = await this.categoryService.getCategories();
    this.tasks = [];
    for (const cat of this.categories) {
      const tasks = await this.taskService.getTasks(cat.id);
      this.tasks.push(...tasks);
    }
    this.isLoading = false;
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