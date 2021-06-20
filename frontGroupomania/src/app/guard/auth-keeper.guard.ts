import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/authentification.service';

@Injectable( {providedIn: 'root' } )
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): true|UrlTree { 
                if (this.authService.isAuth.getValue()) {
                   return true;
                } else if (this.authService.tryAuthByCookie()) {
                  return true;
                } else {
                  return this.router.parseUrl('/login');}
               }
}
