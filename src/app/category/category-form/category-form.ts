import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, MatIconModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  name = '';
  image = '';
  categoryService = inject(CategoryService);
  router = inject(Router);

  save() {
    if (this.name.trim()) {
      this.categoryService.addCategory({
        name: this.name,
        id: 0,
        image: this.image
      });
      this.router.navigate(['/']);
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
