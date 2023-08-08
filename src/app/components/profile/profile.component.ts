import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService, StatData} from '../../services/score.service';

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
      this.scoreService.getUserStat(this.userData.user_id).subscribe((data:StatData) => {
        this.userScore = data;
      });
    }
  }
}
