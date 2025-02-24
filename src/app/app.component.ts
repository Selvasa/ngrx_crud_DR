import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angularNgrxCrud';
  isMenuOpen = signal(false);
  isDarkMode = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((val) => !val);
  }

  toggleDarkMode() {
    this.isDarkMode.update((val) => !val);
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }

}
