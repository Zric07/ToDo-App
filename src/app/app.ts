import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private db = inject(DatabaseService);
    ready = false;
    error: string | null = null;

     async ngOnInit() {
    await this.initDatabase();
  }

  async initDatabase() {
    try {
      await this.db.init();
      this.ready = true;
    } catch (err) {
      this.error = String(err);
    }
  }

  async retryInit() {
    this.error = null;
    this.ready = false;
    await this.initDatabase();
  }
}
