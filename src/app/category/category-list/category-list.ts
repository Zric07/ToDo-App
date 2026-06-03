import { Component, inject } from '@angular/core';
import { Category, Task } from '../../../types';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-category-list',
  imports: [MatIconModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  categoryService = inject(CategoryService);
  taskService = inject(TaskService);
  categories: Category[] = [];
  tasks: Task[] = [];

  constructor(public router: Router) { }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.tasks = [];
    this.categories = await this.categoryService.getCategories();
    for (const cat of this.categories) {
      const tasks = await this.taskService.getTasks(cat.id);
      this.tasks.push(...tasks);
    }
  }

  edit(category: Category) {
    this.categoryService.toggleCategory(category.id);
    this.router.navigate(['/editCategory']).then(() => this.loadData());
  }

  openForm() {
    this.router.navigate(['/categoryForm']).then(() => this.loadData());
  }

  toggleCategory(id: number) {
    this.categoryService.toggleCategory(id);
    this.router.navigate(['/taskList']).then(() => this.loadData());
  }

  getTaskCount(categoryId: number): number {
    return this.tasks.filter(t => t.categoryId === categoryId).length;
  }
}