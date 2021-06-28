import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../type/userType';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth = new BehaviorSubject<boolean>(false);
  isAdmin = new BehaviorSubject<boolean>(false);
  private authToken: string = '';
  private userID: number = -1;
  private userNom: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private apiUrl = 'http://localhost:3000/api/auth'

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getToken() {
    return this.authToken;
  }

  getNom() {
    return this.userNom;
  }

  getUserID() {
    return this.userID;
  }

  createNewUser(signupForm:object) {
    const newUserUrl = this.apiUrl + '/signup';
    return this.http.post(newUserUrl, signupForm)
  }

  loginUser(loginForm:object) {
    const loginUrl = this.apiUrl + '/login';
    return this.http.post<User>(loginUrl, loginForm)
    .pipe(
      tap((response: User) => {
        this.userID = response.userID;
        this.userNom = response.nom;
        this.authToken = response.token;
        if (!document.cookie) {
          document.cookie = "token=" + response.token + '; Expires=' + 3600 + '; SameSite=Lax';
          document.cookie = "nom=" + response.nom + '; Expires=' + 3600 + '; SameSite=Lax';
          document.cookie = 'id=' + response.userID + '; Expires=' + 3600 + '; SameSite=Lax';
        }
        this.isAuth.next(true);
        if (response.isadmin == 1)this.isAdmin.next(true);
        this.router.navigate(['/forum']);
      }),
      catchError(this.handleError<User>('loginUser', )),
    )
  }

  logOut():void {
    this.authToken = '';
    this.userNom = '';
    this.userID = -1;
    document.cookie = "token=''"+ '; Max-Age=' + 0;
    document.cookie = "nom=''" + '; Max-Age=' + 0;
    document.cookie = 'id=-1' + '; Max-Age=' + 0;
    this.isAuth.next(false);
    this.router.navigate(['login']);
  }

  accountSuppression() {
    const suppressUrl = this.apiUrl + '/suppress/' + this.getUserID();
    return this.http.delete<string>(suppressUrl)
    .pipe(
      catchError(this.handleError<string>('suppressAccount', ''))
    )
  }

  tryAuthByCookie():boolean {
    let cookies = (document.cookie.split(';'));
    if (
      cookies.some((item) => item.trim().startsWith('token')) &&
      cookies.some((item) => item.trim().startsWith('nom')) &&
      cookies.some((item) => item.trim().startsWith('id'))
    ) {
      this.authToken = this.getCookieValue('token');
      this.userNom = this.getCookieValue('nom');
      this.userID = Number(this.getCookieValue('id'));
      this.isAuth.next(true);
      return true
    } else return false
  }

  getCookieValue(cname:string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

}