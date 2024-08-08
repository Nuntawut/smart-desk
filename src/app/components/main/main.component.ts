import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../../core/services';
import { ScoreService } from '../../services/score.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SseService } from '../../services/sse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private eventSubscription!: Subscription;

  user:any;
  message:any;

  constructor(
    private localStorageService:LocalStorageService, 
    private electronService: ElectronService, 
    private scoreService:ScoreService,
    private sseService: SseService) { 
    
  }

  ngOnInit() {
    console.log("Main Print")
    this.user = this.localStorageService.getItem('user');
    this.eventSubscription = this.sseService.observeMessages('')
      .subscribe({
        next: (event:any) => this.electronService.ipcRenderer.send("angular-to-main", event.data),
        error: (error:any) => console.error('EventSource error: ', error)
      });

    this.electronService.ipcRenderer.on('data-from-main', (event, data) => {
      if (data) {

          const totalDurationInt = parseInt(data.totalDuration);

          const scoreData = {
              'user_id': this.user.user_id,
              'task_description': data.task_description,
              'score_value': 1,
              'watch_time': totalDurationInt,
          };
          this.scoreService.insert_score(scoreData)
              .then(response => {
                  console.log(response);
              })
              .catch(error => {
                  console.error('Insert score failed.', error);
              });
      } else {
          console.warn('Received null data from main process.');
      }
    });
  }

  ngOnDestroy() {
    this.localStorageService.clear()
    this.eventSubscription.unsubscribe();
  }
}
