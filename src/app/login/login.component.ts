import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private loginService:LoginService, private router:Router) { }

  userCredentials:any = {
    email: "",
    password: ""
  }

  processLogin() {
    this.loginService.login(this.userCredentials);
  }

}
