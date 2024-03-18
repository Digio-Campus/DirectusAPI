import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';
import { SettingsComponent } from './settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RouterModule, SettingsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private loginService:LoginService) { }

  isLoggedIn() {
    return this.loginService.getAuthenticationStatus();
  }

}
