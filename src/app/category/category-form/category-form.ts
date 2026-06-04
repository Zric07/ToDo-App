import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../types';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  name = '';
  image = '';
  categoryService = inject(CategoryService);
  router = inject(Router);

  async create() {
    if (!this.name.trim()) {
      return;
    }

    try {
      await this.categoryService.addCategory({
        name: this.name,
        id: 0,
        image: this.image
      });
      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Kategorie konnte nicht gespeichert werden:', err);
    }
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
