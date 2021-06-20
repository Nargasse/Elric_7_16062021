import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/authentification.service'

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }
  
  nomProfil = this.authService.getNom();

  onAccountSuppression():void {
    this.authService.accountSuppression().subscribe(
      () => this.authService.logOut()
    );
  }
}
