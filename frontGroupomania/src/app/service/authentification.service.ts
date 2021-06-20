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
          document.cookie = "token=" + response.token + '; expire=' + 3600 + '; SameSite=Lax' +'; httpOnly';
          document.cookie = "nom=" + response.nom + '; expire=' + 3600 + '; SameSite=Lax' +'; httpOnly';
          document.cookie = 'id=' + response.userID + '; expire=' + 3600 + '; SameSite=Lax' +'; httpOnly';
        }
        this.isAuth.next(true);
        this.router.navigate(['/forum']);
      }),
      catchError(this.handleError<User>('loginUser', )),
    )
  }

  logOut():void {
    this.authToken = '';
    this.userNom = '';
    this.userID = -1;
    document.cookie = "token=''"+ '; expire=' + -1;
    document.cookie = "nom=''" + this.getNom() + '; expire=' + -1;
    document.cookie = 'id=-1' + this.getUserID() + '; expire=' + -1;
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
      this.authToken = String(cookies.find(row => row.startsWith('token='))).split('=')[1];
      this.userNom = String(cookies.find(row => row.startsWith('nom='))).split('=')[1];
      this.userID = Number(String(cookies.find(row => row.startsWith('id='))).split('=')[1]);
      return true
    } else return false
  }

}