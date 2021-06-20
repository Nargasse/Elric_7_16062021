import { Component, OnInit } from '@angular/core';
import { MediaServeurService } from '../../service/media-serveur.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from '../../service/authentification.service';

import { Post } from '../../type/postType'

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private demandeServeur: MediaServeurService,
    private activatedroute:ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(param => this.getPostList(Number(param.get('position'))));
  }

  //Methodes nécéssitant communication avec le serveur

  posts: Post[] = []; //La liste des posts principaux.
  commentaires: [Post[]] = [[]]; //Pour chaque post, on télécharge ses commentaires, s'il y en a, ce qui permettra d'en afficher quelques-uns.
  nomUsager: string = this.authService.getNom(); //Chaque nom usager étant unique dans la BDD, c'est une méthode efficace pour vérifier qui est l'auteur.

  getPostList(position:number): void {
    this.demandeServeur.getPostList(position)
      .subscribe(posts => {
        this.posts = posts;
        this.getCommentaries();
        });
  }

  getCommentaries(): void {
    for (let i = 0; i < this.posts.length; i ++) {
      this.demandeServeur.getPostList(this.posts[i].id)
        .subscribe(posts => {this.commentaires[i] = posts });
    };
  }

  //Methodes pour la barre d'interaction

  activeInputBox = document.getElementById('newPostForm') as HTMLElement;
    //Sauvegarder cette variable en global permet de toujours s'assurer qu'une seul boîte d'interaction soit ouverte en même temps.
    //On la place de base sur la boîte situé la plus au fond, qui invitera ainsi à créer une nouvelle discussion sans gêner la vue.
  userInputText:string = '';
    //On conserve le texte écrit par l'utilisateur ici pour pouvoir facilement le manipuler avec un double binding.
  userInputTitle:string = '';
    //En suivant la même logique, et en partant du principe qu'on permettra potentiellement un titre sur les commentaires, mieux vaut préparer aussi cette variable.
  inputGoal: string = '';
    //Je sauvegarde ici le but du dernier bouton appuyer pour savoir quel fonction activé lors de la validation d'une form.

  onAnswer(postIndex:number):void {
    this.switchActiveElement(postIndex); //fonction commune permettant de change la form affiché.
    this.userInputText = ''; //on vide la textarea, ou on la remplit dans le cas d'un edit avec le contenu adapté.
    this.inputGoal = 'answer'; //on enregistre la fonction voulu par la form.
  }

  onEdit(postIndex:number):void {
    this.switchActiveElement(postIndex);
    this.userInputText = this.posts[postIndex].texte;
    this.inputGoal = 'edit';
  }
  
  onNewPost (postIndex:number):void {
    this.switchActiveElement(postIndex);
    this.userInputText = '';
    this.inputGoal = 'newPost';
  }

  onSuppress(postIndex:number):void {
    this.demandeServeur.suppressPost(this.posts[postIndex].id)
    .subscribe();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([this.router.url]);
  }

  switchActiveElement(postIndex:number) { //Cette méthode affiche la bonne textArea, retire l'éventuelle précédente.
    if (this.activeInputBox != null) this.activeInputBox.style.visibility = 'hidden';
    this.activeInputBox = document.querySelector('#interactionBox' + postIndex + ' ' + 'form') as HTMLElement
    this.activeInputBox.style.visibility = 'initial';
    this.activeInputBox.focus();
  }

  onSubmit(postIndex:number):void { //Envoie une requête serveur reprenant les paramètres enregistrés par le ngform binding et lors de l'appui du bouton.
    if (this.inputGoal == 'answer') {
      this.demandeServeur.saveNewPost(this.userInputText, this.posts[postIndex].id, this.userInputTitle)
      .subscribe()
    } else if (this.inputGoal == 'edit') {
      this.demandeServeur.saveEditedPost(this.userInputText, this.posts[postIndex].id)
      .subscribe()
    } else if (this.inputGoal == 'newPost') {
      console.log(this.userInputText + ' : ' + this.userInputTitle)
      this.demandeServeur.saveNewPost(this.userInputText, 0, this.userInputTitle)
      .subscribe()
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([this.router.url]);
  }

}
