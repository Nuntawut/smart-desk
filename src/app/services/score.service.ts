import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor() { }

  insert_score(data:any){
    return axios.post('/score/create', data)
  }

  getUserStat(user_id: number): Observable<any> {
    const body = { user_id };

    return new Observable(observer => {
      axios.post<StatData[]>('/score', body)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  getUserScores(user_id: number): Observable<any> {
    
    const body = { user_id };

    return new Observable(observer => {
      axios.post<ScoreData[]>('/score/user_scores', body)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  
}

export interface ScoreData {
  formatted_date: string; // Change the type if necessary
  total_score: number;
}

export interface StatData {
  watch_time: number; // Change the type if necessary
  total_score: number;
}
