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

  showMenu = signal(false);
  selectedCategory = signal<Category | null>(null);
  private pressTimer: any;
  defaultCategory = signal<Category | null>(null);
  
  categories = signal<Category[]>([]);
  tasks = signal<Task[]>([]);
  isLoading = signal(true);

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.db.init();
    await this.ensureDefaultCategory();
    await this.loadData();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url === '/')
    ).subscribe(() => this.loadData());
  }

  private async ensureDefaultCategory() {
    const cats = await this.categoryService.getCategories();
    const existing = cats.find(c => c.id === 1);
    if (!existing) {
        await this.categoryService.addCategory({
            id: 1,
            name: 'Tägliche Aufgaben',
            image: ''
        });
        const updated = await this.categoryService.getCategories();
        this.defaultCategory.set(updated.find(c => c.id === 1) ?? null);
    } else {
        this.defaultCategory.set(existing);
    }
}

  async loadData() {
    this.isLoading.set(true);
    try {
        const cats = await this.categoryService.getCategories();
        this.categories.set(cats.filter(c => c.id !== 1));
        
        const taskPromises = cats.map(cat => this.taskService.getTasks(cat.id));
        const allTasks = await Promise.all(taskPromises);
        this.tasks.set(allTasks.flat());
    } catch (err) {
        console.error('[CategoryList] Fehler:', err);
    } finally {
        this.isLoading.set(false);
    }
}

  edit(category: Category | null) {
    if (!category) return;
    this.categoryService.toggleCategory(category.id);
    this.closeMenu();
    this.router.navigate(['/editCategory']);
}

  async delete(categoryId: number | undefined) {
    if (!categoryId) return;
    await this.categoryService.deleteCategory(categoryId);
    this.closeMenu();
    await this.loadData();
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

    onTouchStart(category: Category) {
    if (this.pressTimer) return;
    this.pressTimer = setTimeout(() => {
        this.selectedCategory.set(category);
        this.showMenu.set(true);
        document.body.style.overflow = 'hidden';
        this.pressTimer = null;
    }, 750);
}

onTouchEnd() {
    if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
    }
}

closeMenu() {
    this.showMenu.set(false);
    this.selectedCategory.set(null);
    document.body.style.overflow = '';
  }
}