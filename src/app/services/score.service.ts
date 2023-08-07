import { Injectable } from '@angular/core';
import axios from 'axios';

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
  
}
