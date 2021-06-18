import { Component } from '@angular/core';
import { AuthService } from './service/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    ) { };
 
    isAuth: boolean = false;

    ngOnInit() {
      this.authService.isAuth.subscribe( isAuth => this.isAuth = isAuth);
    }
  onlogOut() {
    this.authService.logOut();
  }
}