import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatabaseService } from '../../services/database';

@Component({
  selector: 'app-edit-category',
  imports: [FormsModule, MatIconModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  private categoryService = inject(CategoryService);
  private db = inject(DatabaseService);
  private router = inject(Router);
  
  name = signal('');
  image = signal('');
  categoryId = signal(this.categoryService.getCategoryId());

  async ngOnInit() {
    await this.db.init();
    const category = await this.categoryService.getCategoryById(this.categoryId());
    if (category) {
      this.name.set(category.name);
      this.image.set(category.image);
    }
  }

  async save() {
    if (this.name().trim()) {
      await this.categoryService.editCategory(this.categoryId(), {
        name: this.name(),
        id: this.categoryId(),
        image: this.image()
      });
      this.router.navigate(['/']);
    }
  }

  async delete() {
    await this.categoryService.deleteCategory(this.categoryId());
    this.router.navigate(['/']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => this.image.set(reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  back() {
    this.router.navigate(['/']);
  }
}