import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, of } from 'rxjs';
import { LoginService } from './login.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let loginService = inject(LoginService);
  let cookieService = inject(CookieService);
  let router = inject(Router);
  let httpClient = inject(HttpClient);

  const token = cookieService.get("access_token");

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  if (token) {
    const decodedToken = jwtDecode(token);
    const expTimeInSeconds: any = decodedToken.exp;
    const expTimeMilliseconds: any = expTimeInSeconds * 1000;
    const refresh_token = cookieService.get("refresh_token").toString();



    // console.log("current time: " + Date.now())
    // console.log("exp time: " + expTimeMilliseconds)


    //
    if (!isNaN(expTimeMilliseconds) && expTimeMilliseconds > Date.now()) {
      console.log("token NOT expired");
      return next(cloneRequest);
    }
    else {

      let objeto: any = {
        refresh_token: refresh_token,
        mode: "json"
      }

      // httpClient.post("http://localhost:8055/auth/refresh", objeto).subscribe((data: any) => {
      //   console.log("data : " + data.data.access_token)
      //   // acce = data.data.access_token;
      //   console.log("----------------------------------- DENTRO FETCH -----------------------------------")
      //   cookieService.set('access_token', data.data.access_token);
      //   cookieService.set('exp_time', data.data.expires);
      //   cookieService.set('refresh_token', data.data.refresh_token);
      //   req.clone({
      //     setHeaders: {
      //       Authorization: `Bearer ${data.data.access_token}`
      //     }
      //   })

      //   return next(req);
      // })

      // loginService.renewToken().subscribe((newToken:any) => {
      //   localStorage.setItem("new_token", newToken)
      // })


      loginService.renewToken()
      .subscribe({
        next: ((response: any) => {
          localStorage.setItem("new_token2", response)
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('exp_time', response.data.expires);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          cookieService.set('access_token', response.data.access_token);
          cookieService.set('exp_time', response.data.expires);
          cookieService.set('refresh_token', response.data.refresh_token);
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.access_token}`
            }
          })

          return next(req);

        }),
        error: (error => {
          console.log("erroores " + error.errors)
        })
      })
      // httpClient.post("http://localhost:8055/auth/refresh", objeto)
      //   .subscribe({
      //     next: ((response: any) => {

      //       response.forEach((data:any) => {
      //         console.log("data : " + data.data.access_token)
      //         // acce = data.data.access_token;
      //         console.log("----------------------------------- DENTRO FETCH -----------------------------------")
      //         cookieService.set('access_token', data.data.access_token);
      //         cookieService.set('exp_time', data.data.expires);
      //         cookieService.set('refresh_token', data.data.refresh_token);
      //         req.clone({
      //           setHeaders: {
      //             Authorization: `Bearer ${data.data.access_token}`
      //           }
      //         })

      //       });

      //       return next(req);
      //     }),

      //     error: (error => {
      //       console.error('Error al descargar el archivo:', error.errors);
      //       return;
      //     }),


      //   });

      console.log("token expired");

      return next(req);


      // // let objeto:any = {
      // //   refresh_token: cookieService.get("refresh_token"),
      // //   mode: "json"
      // // }


      // console.log("cookie service get " + cookieService.get("refresh_token"))

      // // console.log("daita from loginService: " + loginService.refreshToken2())

      // let acce;

      // // httpClient.post("http://localhost:8055/auth/refresh", objeto).subscribe((data:any) => {
      // //   console.log("data : " + data.data.access_token)
      // //   acce = data.data.access_token;
      // // })

      // const request = req.clone({
      //   setHeaders: {
      //     Authorization: `Bearer ${acce}`
      //   }
      // });





      // // router.navigateByUrl("/");
      // return next(request);
    }


    // console.log("milisegundos a segundos: " + expTimeMilliseconds)

    // const isExpired =
    // expTimeMilliseconds
    //     ? expTimeMilliseconds < Date.now() / 1000
    //     // ? Date.now() > expTimeMilliseconds
    //     : false;

    //   console.log("expTimeMilliseconds " + expTimeMilliseconds)
    //   console.log("Date.now() " + Date.now())

    // const isExpired =
    // expTimeMilliseconds
    //     ? expTimeMilliseconds < (Date.now() + 900000)
    //     : false;


    // const isExpired = 
    //   decodedToken && decodedToken.exp
    //   ? decodedToken.exp < Date.now() / 1000
    //   : false;

    // console.log("exp time: " + test)
    // if (isExpired) {
    //   console.log("token expired");

    //   let objeto = {
    //     "refresh_token": cookieService.get("refresh_token"),
    //     "mode": "json"
    //   }


    //   // router.navigateByUrl("/");
    //   return next(req);
    // }
    // else {
    //   console.log("token NOT expired");
    //   return next(cloneRequest);
    // }

    // return next(cloneRequest).pipe(catchError(x => handleAuthError(x)))
  }
  else
    return next(req);

};
