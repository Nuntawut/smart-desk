import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService, ScoreData, StatData } from '../../services/score.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  watch_time: any;
  total_score: any

  userData: any

  constructor(
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
  ) {}

  ngOnInit(): void {

    this.userData = this.localStorageService.getItem('user');

    if (this.userData) {
      this.scoreService.getUserStat(this.userData.user_id).subscribe((data:StatData) => {
        this.watch_time = data.watch_time;
        this.total_score = data.total_score;
      });

      this.scoreService.getUserScores(this.userData.user_id).subscribe((data:ScoreData[]) => {
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
              borderColor: 'rgb(239, 83, 80)',
              tension: 0.4,
              pointStyle: 'circle',
              pointRadius: 5,
              pointHoverRadius: 10
            }]
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: 'สถิติการใช้งาน 5 วันย้อนหลัง'
              }
            },
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
