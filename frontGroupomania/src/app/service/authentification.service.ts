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
        this.isAuth.next(true);
        this.router.navigate(['/forum']);
      }),
      catchError(this.handleError<User>('loginUser', )),
    )
  }

  accountSuppression() {
    const suppressUrl = this.apiUrl + '/suppress/' + this.getUserID();
    return this.http.delete<string>(suppressUrl)
    .pipe(
      catchError(this.handleError<string>('suppressAccount', ''))
    )
  }

  logOut():void {
    this.authToken = '';
    this.userNom = '';
    this.userID = -1;
    this.router.navigate(['login']);
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
}