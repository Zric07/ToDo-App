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
}
