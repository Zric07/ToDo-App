import { Injectable } from '@angular/core';
import { Category } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private nextId = 1;
  private selectedCategoryId = 0;

  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Category): void {
    category.id = this.nextId++;
    this.categories.push(category);
  }

  editCategory(id: number, category: Category): void {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = category;
    }
  }

  deleteCategory(id: number): void {
    this.categories = this.categories.filter(t => t.id !== id);
  }

  toggleCategory(id: number): void {
    this.selectedCategoryId = id;
  }

  getCategoryId(): number {
    return this.selectedCategoryId;
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }
}
