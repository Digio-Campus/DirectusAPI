import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlBase = "http://localhost:8055/auth/login"
  private isAuthenticated:boolean = false;


  constructor(private httpClient:HttpClient, private router:Router) {

   }

   login(email:string, pass:string) {
      const datos = {
        email: email,
        password: pass
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      })

      this.httpClient.post(this.urlBase, datos, { headers })
      .subscribe((response:any) => {
        //Guardamos los datos de usuario en el localStorage
        sessionStorage.setItem("user", JSON.stringify(response.data));

        //Mostramos la template de administración
        this.router.navigate(['/home']);
        this.isAuthenticated = true;
      },
      error => {
        console.log("Error al iniciar sesion")
      })
   }

   getAuthenticationStatus():boolean {
    return this.isAuthenticated;
   }

   logOut() {
    this.isAuthenticated = false;
    this.router.navigate(['/']);
   }

}
