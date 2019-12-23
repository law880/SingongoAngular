import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginMessageComponent } from './auth/login-form/login-message/login-message.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { ROUTES} from './app.routes';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { LogoutComponent } from './auth/logout/logout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileViewComponent } from './auth/profile-view/profile-view.component';
import {UserInfoService } from './auth/user-info.service';
import { ChangePasswordViewComponent } from './auth/profile-view/change-password-view/change-password-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    LoginMessageComponent,
    HomeComponent,
    LogoutComponent,
    NavigationComponent,
    ProfileViewComponent,
    ChangePasswordViewComponent,
  ],
  imports: [
    RouterModule.forRoot(
      ROUTES,
      {enableTracing: true}
    ),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthGuardService, AuthService, UserInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
