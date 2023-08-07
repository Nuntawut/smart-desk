import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/auth.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(private router:Router, private authService: AuthService) { }
  
  signout(){
    console.log("Signout")
    if (this.authService.signout()){
      this.router.navigate(['/signin']);
    }
  }
}
