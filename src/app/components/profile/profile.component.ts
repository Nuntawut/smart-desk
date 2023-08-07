import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userData: any;
  userScore: any

  constructor(
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
  ) {

    this.userData = this.localStorageService.getItem('user');
    if (this.userData) {
      console.log(this.userData.user_id)
      this.scoreService.select_score({
        'user_id': this.userData.user_id
      })
      .then(response => {
        this.userScore = response.data
        console.log('Select score successful!', response.data);
      })
      .catch(error => {
        console.error('Select score successful!', error);
      });
    }
  }
}
