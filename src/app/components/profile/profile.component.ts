import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService} from '../../services/score.service';
import {AuthService} from '../../auth/auth.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userData: any;
  userProfile: any = {};
  userScore: any = {}

  constructor(
    private authService:AuthService,
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
  ) {

    this.userData = this.localStorageService.getItem('user');
    if (this.userData) {
      this.authService.getProfile(this.userData.token)
        .then(response => {
          this.userProfile = response.data;
        })
        .catch(error => {
          console.log('Access denied:', error);
        });

      this.scoreService.getUserStat(this.userData.token)
        .then(response => {
          this.userScore = response.data;
        })
        .catch(error => {
          console.log('Access denied:', error);
        });
    }
  }
}
