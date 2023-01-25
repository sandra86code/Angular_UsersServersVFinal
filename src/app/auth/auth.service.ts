import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, switchMap, catchError } from 'rxjs';
import { UsersService } from '../users/services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthResponse } from '../servers/interfaces/token.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UsersService, private http: HttpClient, private cookieService: CookieService) { }
  url: string = 'http://localhost:8000/auth/login';

 
  isAuthenticated():Observable<boolean> {
    return this.http.get<AuthResponse>('http://localhost:8000/jwt')
    .pipe( switchMap(token => {
      return of(true);
    }),catchError(error => {
      return of(false);
    }))
  }
 
  login(email: string, password: string):Observable<boolean>{
    return this.http.post<AuthResponse>(this.url, {email, password })
    .pipe( switchMap(token => {
      this.cookieService.set('token', token.access_token);
      return of(true);
    }),catchError(error => {
      this.cookieService.delete('token');
      return of(false);
    }))
  }
 
  logout() {
    this.cookieService.delete('token');
  }

}
