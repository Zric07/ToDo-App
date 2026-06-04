import { Component, inject, OnInit, signal } from '@angular/core';
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
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private db = inject(DatabaseService);
  
  categories = signal<Category[]>([]);
  tasks = signal<Task[]>([]);
  isLoading = signal(true);

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.db.init();
    await this.loadData();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url === '/')
    ).subscribe(() => this.loadData());
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const cats = await this.categoryService.getCategories();
      this.categories.set(cats);
      
      const taskPromises = cats.map(cat => this.taskService.getTasks(cat.id));
      const allTasks = await Promise.all(taskPromises);
      this.tasks.set(allTasks.flat());
    } catch (err) {
      console.error('[CategoryList] Fehler:', err);
    } finally {
      this.isLoading.set(false);
    }
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
    return this.tasks().filter(t => t.categoryId === categoryId).length;
  }
}