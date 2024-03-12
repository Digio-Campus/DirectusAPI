import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlBase = "http://localhost:8055/auth/login"
  private refresh = "http://localhost:8055/auth/refresh";
  private isAuthenticated: boolean = false;


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  login(userData: any) {

    this.httpClient.post(this.urlBase, userData)
      .subscribe((response: any) => {
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          this.cookieService.set('access_token', response.data.access_token);
          this.cookieService.set('exp_time', response.data.expires);
          this.cookieService.set('refresh_token', response.data.refresh_token);
          this.router.navigate(['/home']);
          // console.log("access_token: " + response.data.access_token)

          
        }
        else {
          alert(response.errors);
        }
      })

  }

  refreshToken() {
    let test = this.cookieService.get('directus_refresh_token');

    console.log("refresh token test: " + test)

    let objeto = {
      "refresh_token": this.cookieService.get("refresh_token"),
      "mode": "json"
    }

    const header = new HttpHeaders().set('Content-type', 'application/json');
    // return this.httpClient.post(this.refresh, objeto);
    return this.httpClient.post(this.refresh, objeto);
    // return this.httpClient.set()
  }

  refreshToken2() {
    let objeto: any = {
      refresh_token: this.cookieService.get('refresh_token'),
      mode: "json"
    }

    let daita;

    this.httpClient.post("http://localhost:8055/auth/refresh", objeto).subscribe((data: any) => {
      console.log("data : " + data.data.access_token)
      console.log("data data " + data.data)
      daita = data.data.access_token;
      return;
    })

    return daita;
  }

  renewToken(): Observable<any> {
    const refresh_token = this.cookieService.get("refresh_token");
    const objeto = { refresh_token, mode: "json" };
    return this.httpClient.post("http://localhost:8055/auth/refresh", objeto);
  }

  //  login(email:string, pass:string) {

  //     const usuario = {
  //       email: email,
  //       password: pass
  //     }

  //     const headers = new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })

  //     this.httpClient.post(this.urlBase, usuario, { headers })
  //     .subscribe((response:any) => {

  //       //Guardamos los datos de usuario en el sessionStorage
  //       sessionStorage.setItem("user", JSON.stringify(response.data));

  //       //Mostramos la template de contenido
  //       this.router.navigate(['/home']);
  //       this.isAuthenticated = true;
  //     },
  //     error => {
  //       console.log("Error al iniciar sesion")
  //     })
  //  }

  getAuthenticationStatus(): boolean {

    if (localStorage.getItem("user") != null) {
      this.isAuthenticated = true;
    }

    return this.isAuthenticated;
  }

  logOut() {
    this.isAuthenticated = false;
    sessionStorage.clear();
    localStorage.removeItem("user");
    this.router.navigate(['/']);
  }

}
