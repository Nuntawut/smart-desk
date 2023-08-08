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

  watch_time: any;
  total_score: any

  constructor(
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
  ) {

    this.userData = this.localStorageService.getItem('user');
    if (this.userData) {
      this.scoreService.getUserStat(this.userData.user_id).subscribe((data:StatData) => {
        this.watch_time = data.watch_time;
        this.total_score = data.total_score;
      });
    }
  }
}
