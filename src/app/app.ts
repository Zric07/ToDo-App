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

    async ngOnInit() {
        await this.db.init();
        this.ready = true;
    }
}
