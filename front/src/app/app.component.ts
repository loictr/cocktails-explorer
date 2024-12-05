import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Add RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule], // Add RouterModule here
  template: `
    <header class="header">
      <nav class="container">
        <a routerLink="/" class="brand">
          <img src="android-chrome-192x192.png" alt="Cocktail Explorer Logo">
          <h1>Cocktail Explorer</h1>
        </a>
        <a href="https://loictr.github.io/portfolio/projects/cocktail-recommendation/" class="about">About</a>
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
        #1892D9,
        #108D6E
      );
      background-size: 300% 100%;
      animation: gradient 20s ease infinite;
      color: white;
      padding: 1.5rem 0;
      
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);

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
        vertical-align: baseline;
      }

      a:hover{
        text-decoration: none;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      cursor: pointer;
    }

    .brand:hover {
      text-decoration: none;
    }

    .about {
      margin-left: auto;
    }

    @media (max-width: 600px) {
      .header{
        text-align:center;
      }
      .header img {
        height: 7rem;
        margin:0;
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
      .brand {
        flex-direction: column;
        width: 100%;
      }
      .about {
        margin: 1rem 0 0 0;
        width: 100%;
      }
    }
  `]
})
export class AppComponent {}