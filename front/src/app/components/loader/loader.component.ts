import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      min-height: 200px;
    }
    
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid var(--background-color);
      border-bottom-color: var(--primary-color);
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoaderComponent {}
