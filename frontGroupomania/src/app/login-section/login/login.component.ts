import { Component, OnInit } from '@angular/core';
import { MediaServeurService } from '../../service/media-serveur.service';
import { AuthService } from '../../service/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private router: Router) {  }

  ngOnInit(): void {
  }

  onLogin(loginForm:object) {
    this.authService.loginUser(loginForm).subscribe();
  };

  toSignUp() {
    this.router.navigate(['signup']);
  }

}
