import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { MainComponent } from './components/main/main.component'
import { HomeComponent } from './components/home/home.component'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { SettingComponent } from './components/setting/setting.component'
import { ProfileComponent } from './components/profile/profile.component'
import { SigninComponent } from './components/signin/signin.component'
import { SignupComponent } from './components/signup/signup.component'

import {authGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: 'main', component: MainComponent,
  canActivate: [authGuard],
  children: [
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'setting', component: SettingComponent},
    {path: 'profile', component: ProfileComponent},
    {path: '', 
      redirectTo: 'home', 
      pathMatch: 'full'          
    }
  ]
},

  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {
    path: '', redirectTo: 'signin', pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
