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
        <img src="android-chrome-192x192.png" alt="Cocktail Explorer Logo">
        <h1>Cocktail Explorer</h1>
        <a href="https://loictr.github.io/portfolio/projects/cocktail-recommendation/">About</a>
      </nav>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .header {
      background: linear-gradient(to right, 
        #FF8ED4,
        #FFAA94,
        #FFCA7A,
        #CAA6EC
      );
      background-size: 200% 100%;
      //animation: gradient 30s ease infinite;
      color: white;
      padding: 0.2rem 0;
      margin-bottom: 2rem;

      nav{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0;
      }

      img{
        height: 10rem;
        margin-right: 1rem;
        vertical-align: middle;
      }

      h1 {
        display: inline-block;
        margin: 0;
        font-size: 3rem;
        font-family: "Poppins", sans-serif;
        font-weight: 400;
        font-style: normal;
      }

      a {
        color: white;
        text-decoration: none;
        font-size: 1.5rem;
        margin-left: auto;
        vertical-align: baseline;
        margin-left: 4rem;
      }

      a:hover{
        text-decoration: underline;
      }
    }

    @media (max-width: 600px) {
      .header img {
        height: 3rem;
      }
      .header h1 {
        font-size: 2rem;
        text-align:center;
        flex-grow: 1;
      }
      .header a {
        font-size: 1rem;
        text-align:center;
        margin-left: 0;
        width: 100%;
      }
    }
  `]
})
export class AppComponent {}