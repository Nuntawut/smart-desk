import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor() { }

  fetchTitleOptions(){
    return axios.get('/option/title')
  }

  fetchInstitutionOptions(){
    return axios.get('/option/institution')
  }
}
