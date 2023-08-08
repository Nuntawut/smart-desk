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

  select_score(data:any){
    console.log("select_score: ",data)
    return axios.post('/score', data)
  }

  getUserScores(user_id: number): Observable<any> {
    const body = { user_id }; // Send user_id in request body

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
