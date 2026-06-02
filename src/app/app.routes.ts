import { Routes } from '@angular/router';
import { TaskList } from './task/task-list/task-list';
import { TaskForm } from './task/task-form/task-form';
import { CategoryList } from './category/category-list/category-list';
import { CategoryForm } from './category/category-form/category-form';
import { EditCategory } from './category/edit-category/edit-category';
import { EditTask } from './task/edit-task/edit-task';
import { TaskItem } from './task/task-item/task-item';

export const routes: Routes = [
    { path: '', component: CategoryList },
    { path: 'categoryForm', component: CategoryForm },

    { path: 'taskList', component: TaskList },
    { path: 'taskForm', component: TaskForm },
    { path: 'taskItem', component: TaskItem },

    { path: 'editCategory', component: EditCategory },
    { path: 'editTask', component: EditTask }
];
