import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private email:any = "";
  private password:any = "";
  constructor(private loginService:LoginService, private router:Router) { }

  processLogin(email:string, password:string) {
    event?.preventDefault()
    this.loginService.login(email,password);
  }

}
