import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/auth.service'
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(
    private electronService: ElectronService, 
    private router:Router, 
    private authService: AuthService) { }
  
  signout(){
        if (this.authService.signout()){
          this.router.navigate(['/signin']);
        }
  }
}
