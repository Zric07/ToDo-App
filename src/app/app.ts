import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './database';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    await this.db.init();
  }
}
