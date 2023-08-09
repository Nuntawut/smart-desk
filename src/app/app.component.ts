import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { APP_CONFIG } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private router: Router
  ) {
    
    console.log('APP_CONFIG', APP_CONFIG);
    if (this.electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      this.router.navigate(['/main']);
    } else {
      console.log('Run in browser');
    }
  }
}
