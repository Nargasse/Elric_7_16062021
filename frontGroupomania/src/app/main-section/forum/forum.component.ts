import { Component, OnInit } from '@angular/core';
import { MediaServeurService } from '../../service/media-serveur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/authentification.service';

import { Post } from '../../type/postType'

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {

  posts: Post[] = [];
  commentaires: [Post[]] = [[]];
  postMaitre: Post = { id: -1, nom: '', userID: -1, date: '', titre: '', texte: '', position: -1};
  nomUsager: string = this.authService.getNom();

  constructor(
    private postService: MediaServeurService,
    private activatedroute:ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(param => this.onParamMapChange(param.get('masterPost')));
  }

  getPostList(masterPostId:any): void {
    this.postService.getPostList(masterPostId)
      .subscribe((posts:Post[]) => {
        this.posts = posts;
        this.getCommentaries();
        });
  }

  getOnePost(postId:any): void {
    this.postService.getOnePost(postId)
      .subscribe((newMasterPost:Post[]) => {
        this.postMaitre = newMasterPost[0];
        });
  }

  getCommentaries(): void {
    for (let i = 0; i < this.posts.length; i ++) {
      this.postService.getPostList(this.posts[i].id)
        .subscribe((posts:Post[]) => {this.commentaires[i] = posts });
    };
  }

  inputBox: HTMLElement = new HTMLElement;
  submitType: string = '';
  userInput = {texte: ''};

  onAnswer(postNumber:any):void {
    this.switchActiveElement(postNumber);
    this.submitType = 'answer';
    let textArea = document.querySelector('#textBox' + postNumber + ' ' + 'textarea') as HTMLElement;
    this.userInput.texte = '';
    
  }

  onEdit (postNumber:any):void {
    this.switchActiveElement(postNumber);
    const textArea = document.querySelector('#textBox' + postNumber + ' ' + 'textarea') as HTMLElement;
    let textToChange = (postNumber == 'Master') ? this.postMaitre.texte : this.posts[postNumber].texte;
    this.userInput.texte = textToChange;
    this.submitType = 'edit';
  }

  onCreateNewTopic(): void {
    if (this.inputBox) this.inputBox.style.visibility = 'hidden';
    this.inputBox = document.getElementById('newPost') as HTMLElement;
    this.inputBox.style.visibility = 'initial';
    this.inputBox.focus();
  }

  onTextSubmit (texte:string, postNumber:number|string):void {
    if (this.submitType == 'answer') {
      this.postService.saveNewPost(texte, this.getPostId(postNumber))
      .subscribe(); //Rajouter un retour et placer le feedback en visuel et dynamique, au pire avec juste un refresh de la page.
    } else if (this.submitType == 'edit') {
      this.postService.saveEditedPost(texte, this.getPostId(postNumber))
      .subscribe();
    }
  }

  onSuppress (postNumber:string|number):void {
    this.postService.suppressPost(this.getPostId(postNumber))
    .subscribe();
  }

  onNewPost(newPostForm:any): void {
    this.postService.saveNewPost(newPostForm.texte, 0, newPostForm.titre)
      .subscribe();
  }

  getPostId(postNumber:any): number {
    return (postNumber == 'Master') ? this.postMaitre.id : this.posts[postNumber].id;
  }

  switchActiveElement(postId:string|number):void {
    if (this.inputBox) this.inputBox.style.visibility = 'hidden'; //Rajouter un clean-up ici avec une éventuelle garde anti-suppression par erreur.
    this.inputBox = document.getElementById('textBox' + postId) as HTMLElement;
    this.inputBox.style.visibility = 'initial';
    this.inputBox.focus();
  }

  onParamMapChange(newParam:any) {
    this.getOnePost(newParam);
    this.getPostList(newParam);
  }

  onForwardNavigation(postNumber:number):void {
    this.router.navigate(['forum/' + this.posts[postNumber].id]);
  }

}