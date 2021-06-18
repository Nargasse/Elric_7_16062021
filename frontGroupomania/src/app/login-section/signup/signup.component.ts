import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/authentification.service';
import { Router } from '@angular/router';
import { serverError } from 'src/app/type/serverError';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router) {  }

  ngOnInit(): void {
  }

  onSignUp(loginForm:object) {
    try {
      this.authService.createNewUser(loginForm).subscribe(
        () => this.authService.loginUser(loginForm).subscribe()
      )
    } catch (error) {
      (error:serverError) => {
        const errorBox = document.getElementById("errorDisplay") as HTMLElement;
        if (error.status == 403) {
          errorBox.innerText = error.error.msg;
        } else {
          errorBox.innerText = "Une erreur inconnue c'est produite. Veuillez réessayez."
        }
      }
    }
    
      
    }

  toLogin() {
    this.router.navigate(['login']);
  }

}
