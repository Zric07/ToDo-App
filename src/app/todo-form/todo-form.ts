import { Component, inject } from '@angular/core';
import { TodoService } from '../todo';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})
export class TodoForm {
  name = '';
  todoService = inject(TodoService);
  router = inject(Router);

  save(){
    this.todoService.addTodo({
      name: this.name, completed: false,
      id: 0
    });
    this.router.navigate(['/']);
  }

}
