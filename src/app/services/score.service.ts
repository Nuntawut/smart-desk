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

  getUserStat(token: string){
    return axios.get('/score', {headers: {Authorization: token}})
  }

  getUserScores(token: string): Observable<any> {

    return new Observable(observer => {
      axios.get<ScoreData[]>('/score/user_scores', {headers: {Authorization: token}})
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

