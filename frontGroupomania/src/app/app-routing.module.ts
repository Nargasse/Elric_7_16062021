import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth-keeper.guard';

import { UrlNotFoundComponent } from './common-html/url-not-found/url-not-found.component';

import { LoginComponent } from './login-section/login/login.component';
import { SignupComponent } from './login-section/signup/signup.component';

import { ForumComponent } from './main-section/forum/forum.component';
import { ProfilComponent } from './main-section/profil/profil.component'

const routes: Routes = [
  { path: '', redirectTo: '/forum/0', pathMatch: 'full'},
  { path: 'forum', redirectTo: 'forum/0', pathMatch: 'full' },
  { path: 'forum/:masterPost', component: ForumComponent, canActivate: [AuthGuard]},

  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent  },

  { path: '**', component: UrlNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
