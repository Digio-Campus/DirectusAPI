import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RouterModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'DirectusAPI';

  constructor(private loginService:LoginService) {

  }


  isLoggedIn() {
    return this.loginService.getAuthenticationStatus();
  }

  logOut() {
    this.loginService.logOut();
  }
}
