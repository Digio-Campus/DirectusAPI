import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, tap, shareReplay, finalize, take, switchMap, BehaviorSubject, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlBase = "http://localhost:8055/auth/login"
  private refresh = "http://localhost:8055/auth/refresh";
  private isAuthenticated: boolean = false;

  // public $refreshToken = new Subject<boolean>;
  // public $refreshTokenReceived = new Subject<boolean>;


  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    // this.$refreshToken.subscribe((res: any) => {
    //   console.log("variable refresh token " + res)
    //   console.log("cookie access: " + this.cookieService.get("refresh_token"));

    //   this.renewToken()
    // })
  }

  // renewToken() {
  //   const refresh_token = this.cookieService.get("refresh_token");
  //   const objeto = {
  //     "refresh_token": this.cookieService.get("refresh_token"),
  //     "mode": "json"
  //   };
  //   this.httpClient.post("http://localhost:8055/auth/refresh", objeto).subscribe((res: any) => {
  //     this.cookieService.set("access_token", res.data.access_token);
  //     this.$refreshTokenReceived.next(true);

  //   });
  // }

  login(userData: any) {

    this.httpClient.post(this.urlBase, userData)
      .subscribe((response: any) => {
        if (response.data) {
          // localStorage.setItem('user', JSON.stringify(response.data));
          // this.cookieService.set('access_token', response.data.access_token);
          // this.cookieService.set('exp_time', response.data.expires);
          // this.cookieService.set('refresh_token', response.data.refresh_token);

          this.cookieService.set("tokens", JSON.stringify(response.data))

          // localStorage.setItem("tokens", JSON.stringify(response.data));

          this.router.navigate(['/home']).then(() => {
            // Refrescar la página después de navegar a '/home'
            window.location.reload();
          });

        }
        else {
          alert(response.errors);
        }
      })

  }

  // refreshToken() {
  //   let objeto = {
  //     "refresh_token": this.cookieService.get("refresh_token"),
  //     "mode": "json"
  //   }

  //   // const header = new HttpHeaders().set('Content-type', 'application/json');
  //   // return this.httpClient.post(this.refresh, objeto);
  //   return this.httpClient.post(this.refresh, objeto, {});
  //   // return this.httpClient.set()
  // }

  // refreshToken2() {
  //   let objeto: any = {
  //     refresh_token: this.cookieService.get('refresh_token'),
  //     mode: "json"
  //   }

  //   this.httpClient.post("http://localhost:8055/auth/refresh", objeto).subscribe((data: any) => {
  //     console.log("data : " + data.data.access_token)
  //     console.log("data data " + data.data)
  //     this.cookieService.set("access_token", data.data.access_token);
  //     return;
  //   })

  //   // return daita;
  // }



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

    // if (localStorage.getItem("user") != null) {
    if (this.cookieService.get("tokens") != null) {
      this.isAuthenticated = true;
    }

    return this.isAuthenticated;
  }

  logOut() {
    this.isAuthenticated = false;
    // sessionStorage.clear();
    this.cookieService.delete("access_token")
    this.cookieService.delete("refresh_token")
    this.cookieService.delete("exp_time")
    this.cookieService.delete("tokens")
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    this.router.navigate(['/']);
  }

  // rfrToken() {

  //   console.log("EJECUTANDOSE RFRTOKEN")

  //   let tokens: any = this.cookieService.get("tokens");
  //   // let tokens: any = localStorage.getItem("tokens");
  //   if (!tokens) return;
  //   tokens = JSON.parse(tokens);
  //   let refreshToken = tokens.refresh_token;

  //   console.log("REFRESH TOKEN: " + refreshToken)

  //   // console.log("REFRESH TOKEN!!! " + Object.values(tokens))

  //   let objeto: any = {
  //     refresh_token: refreshToken,
  //     mode: "json"
  //   }

  //   return this.httpClient
  //   .post<any>("http://localhost:8055/auth/refresh", objeto)
  //   .pipe(
  //     tap((tokens: any) => this.cookieService.set("access_token", tokens.data.access_token)),
  //     tap((tokens: any) => this.cookieService.set("exp_time", tokens.data.expires)),
  //     tap((tokens: any) => this.cookieService.set("refresh_token", tokens.data.refresh_token)),
  //     tap((tokens: any) => this.cookieService.set("tokens", JSON.stringify(tokens.data))),
  //     tap((tokens: any) => localStorage.setItem("tokens", JSON.stringify(tokens.data))),
  //     shareReplay(1)
  //   );
  // }
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  rfrToken(): any {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;

      this.refreshTokenSubject.next(null);

      let tokens: any = this.cookieService.get("tokens");
      if (!tokens) return;
      tokens = JSON.parse(tokens);
      let refreshToken = tokens.refresh_token;

      console.log("REFRESH TOKEN: " + refreshToken)

      // console.log("REFRESH TOKEN!!! " + Object.values(tokens))

      let objeto: any = {
        refresh_token: refreshToken,
        mode: "json"
      }

      return this.httpClient
        .post<any>("http://localhost:8055/auth/refresh", objeto)
        .pipe(
          // tap((tokens: any) => this.cookieService.set("access_token", tokens.data.access_token)),
          // tap((tokens: any) => this.cookieService.set("exp_time", tokens.data.expires)),
          // tap((tokens: any) => this.cookieService.set("refresh_token", tokens.data.refresh_token)),
          tap((tokens: any) => this.cookieService.set("tokens", JSON.stringify(tokens.data))),
          // tap((tokens: any) => localStorage.setItem("tokens", JSON.stringify(tokens.data))),
          finalize(() => this.refreshTokenInProgress = false)
        );
    } else {
      return this.refreshTokenSubject.pipe(
        take(1),
        switchMap((res) => {
          if (res) {
            return of(res);
          } else {
            return this.rfrToken();
          }
        })
      );
    }
  }

  isTokenExpired() {
    const token = this.cookieService.get("tokens")
    if (!token) return true;

    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();


    return expirationDate < now;


  }

}
