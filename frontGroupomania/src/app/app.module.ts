import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guard/tokenizer-interceptor.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProfilComponent } from './main-section/profil/profil.component';
import { LoginComponent } from './login-section/login/login.component';
import { SignupComponent } from './login-section/signup/signup.component';

import { ForumComponent } from './main-section/forum/forum.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfilComponent,
    LoginComponent,
    SignupComponent,
    ForumComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { constructor(router: Router) {} }
