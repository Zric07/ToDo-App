import { inject, Injectable } from '@angular/core';
import { Category } from '../../types';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  db = inject(DatabaseService);
  private selectedCategoryId = 0;

  getCategories(): Promise<Category[]> {
    return this.db.getCategories();
  }

  addCategory(category: Category): Promise<void> {
    return this.db.addCategory(category.name, category.image);
  }

  editCategory(id: number, category: Category): Promise<void> {
    return this.db.editCategory(id, category.name, category.image);
  }

  deleteCategory(id: number): Promise<void> {
    return this.db.deleteCategory(id);
  }

  toggleCategory(id: number): void {
    this.selectedCategoryId = id;
  }

  getCategoryId(): number {
    return this.selectedCategoryId;
  }

  getCategoryById(id: number): Promise<Category | undefined> {
    return this.db.getCategories().then(cats => cats.find(c => c.id === id));
  }
}
