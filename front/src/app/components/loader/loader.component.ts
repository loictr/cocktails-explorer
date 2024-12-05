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
      width: 50px;
      height: 50px;
      border: 4px solid rgba(239, 176, 144, 0.2);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    
    @keyframes spin {
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
