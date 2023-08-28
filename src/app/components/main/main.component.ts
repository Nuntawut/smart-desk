import { Component } from '@angular/core';
import { ElectronService } from '../../core/services';
import { ScoreService } from '../../services/score.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  user:any;
  message:any;

  constructor(
    private socketService: SocketService, 
    private localStorageService:LocalStorageService, 
    private electronService: ElectronService, 
    private scoreService:ScoreService) { 
    // Connect to the Socket.IO server when the component initializes
    
  }

  ngOnInit() {
    console.log("Main Print")
    this.socketService.connect();

    this.user = this.localStorageService.getItem('user');

    this.electronService.ipcRenderer.on('data-from-main', (event, data) => {
      if (data) {

          const totalDurationInt = parseInt(data.totalDuration, 10);
          
          const scoreData = {
              'user_id': this.user.user_id,
              'task_description': data.task_description,
              'score_value': 10,
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
  
    // Subscribe to incoming messages from the server
    this.socketService.onMessage().subscribe((data: any) => {
      console.log("Data from Socket Server", data)
      this.electronService.ipcRenderer.send("angular-to-main", data)
    });
  }

  ngOnDestroy() {
    this.localStorageService.clear()
    this.socketService.disconnect();
  }
}
