import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../types';

@Component({
  selector: 'app-edit-category',
  imports: [FormsModule, MatIconModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  name = '';
  image = '';
  categoryService = inject(CategoryService);
  category: Category | undefined
  categories: Category[] = [];
  router = inject(Router);

  async ngOnInit() {
    this.category = this.categoryService.getCategoryById(this.categoryService.getCategoryId());
    this.name = this.category!.name;
    this.image = this.category!.image;
  }

  save() {
    if (this.name.trim()) {
      this.categoryService.editCategory(this.categoryService.getCategoryId(), {
        name: this.name,
        id: this.categoryService.getCategoryId(),
        image: this.image
      });
      this.router.navigate(['/']);
    }
  }

    delete() {
      this.categoryService.deleteCategory(this.categoryService.getCategoryId());
      this.categories = this.categoryService.getCategories();
      this.router.navigate(['/']);
    }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.image = reader.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  }

  back() {
    this.router.navigate(['/']);
  }

}