import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const cookieService:any = inject(CookieService);
  const loginService:any = inject(LoginService);

  const jwtToken = getJwtToken();

  // Si ha expirado el token
  if(loginService.isTokenExpired()) {
    console.log("TOKEN EXPIRED")
    // Nos suscribimos al observable que nos devuelve el nuevo token
    loginService.rfrToken()?.subscribe((newToken:any) => {
      if (newToken) {
        var cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        return next(cloned);
      } 
      else {
        return next(req);
      }
    });
  } 
  else if (jwtToken) {
    var cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(cloned);
  } 
  else {
    return next(req);
  }
  
  return next(req);

};


function getJwtToken(): string | null {
  const cookieService:any = inject(CookieService);
  let token: any = cookieService.get("tokens");

  if (!token) return null;
  return JSON.parse(token).access_token;
}