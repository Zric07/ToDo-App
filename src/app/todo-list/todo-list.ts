import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from '../../types';
import { CommonModule } from '@angular/common';
import { TodoService } from '../todo';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, MatIconModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  todoService = inject(TodoService);
  todos: Todo[] = [];

  async ngOnInit() {
    this.todos = await this.todoService.getTodos();
  }

  constructor(public router: Router){}

  openForm(){
    this.router.navigate(['/form']);
  }

  async toggle(todo: Todo) {
    await this.todoService.toggleTodo(todo.id);
    this.todos = await this.todoService.getTodos();
  }

  async delete(todo: Todo) {
    await this.todoService.deleteTodo(todo.id);
    this.todos = await this.todoService.getTodos();
  }
}
