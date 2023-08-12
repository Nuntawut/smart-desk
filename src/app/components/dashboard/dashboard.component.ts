import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService, ScoreData } from '../../services/score.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  userData: any
  userScore: any = {}

  constructor(
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
) {}

  ngOnInit(): void {

    this.userData = this.localStorageService.getItem('user');

    if (this.userData) {
      this.scoreService.getUserStat(this.userData.token)
      .then(response => {
        this.userScore = response.data;
      })
      .catch(error => {
        console.log('Access denied:', error);
      });

      this.scoreService.getUserScores(this.userData.token).subscribe((data:ScoreData[]) => {
        const dates = data.map(item => item.formatted_date);
        const scores = data.map(item => item.total_score);
        console.log(dates)
  
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: 'คะแนน',
              data: scores,
              borderColor: '#880a1f',
              backgroundColor: '#ffa3b3',
              tension: 0.4,
              pointStyle: 'circle',
              pointRadius: 5,
              pointHoverRadius: 10
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'วัน/เดือน/ปี'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'คะแนน'
                }
              }
          }
        }
        });
      });
    }
  }
}
