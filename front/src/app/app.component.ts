import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <header class="header">
      <nav class="container">
        <img src="apple-touch-icon.png" alt="">
        <h1>Cocktail Explorer</h1>
      </nav>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 0;
      margin-bottom: 2rem;

      img{
        height: 5rem;
        margin-right: 1rem;
        vertical-align: middle;
        
      }
    }
    h1 {
      display: inline-block;
      margin: 0;
      font-size: 3rem;
      vertical-align: middle;
      font-family: "Poppins", sans-serif;
      font-weight: 400;
      font-style: normal;
    }
  `]
})
export class AppComponent {}