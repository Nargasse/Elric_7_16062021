import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Post } from '../type/postType'
import { AuthService } from './authentification.service';


@Injectable({
  providedIn: 'root'
})

export class MediaServeurService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  private apiUrl = 'http://localhost:3000/api/posts'

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getPostList(position: number): Observable<Post[]> {
    const postListUrl = `${this.apiUrl}/list/${position}`
    return this.http.get<Post[]>(postListUrl)
      .pipe(
        catchError(this.handleError<Post[]>('getPost', []))
      );
  }

  getOnePost(postID: number): Observable<Post[]> {
    const onePostUrl = `${this.apiUrl}/one/${postID}`;
    return this.http.get<Post[]>(onePostUrl)
      .pipe(
        catchError(this.handleError<Post[]>('getOnePost', ))
      )
  }

  saveNewPost(texte: string, postId: number, titre: string = '') {
    const timestamp = (new Date()).toLocaleString().replace(", ", " à ");
    const postListUrl = `${this.apiUrl}/new`
    const nouveauPost = {
      userID: this.authService.getUserID(),
      nom: this.authService.getNom(),
      titre: titre,
      date: timestamp,
      texte: texte,
      position: postId,
    };
    
    return this.http.post(postListUrl, nouveauPost).pipe(
      catchError(this.handleError<Post[]>('getPost', []))
    );
  }

  saveEditedPost(texte: string, postId: number) {
    const editPostUrl = `${this.apiUrl}/edit/${postId}`
    return this.http.put(editPostUrl, {texte: texte}).pipe(
      catchError(this.handleError<any>('updatePost', ''))
    )
  }

  suppressPost(postId:number) {
    const suppressPostUrl = `${this.apiUrl}/delete/${postId}`;
    return this.http.delete(suppressPostUrl).pipe(
      catchError(this.handleError<any>('suppressPost', ''))
    )
  }
}
