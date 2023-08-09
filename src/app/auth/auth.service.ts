import { Injectable } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../services/local-storage.service';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://203.158.7.77:3000';
  
  constructor(private http:HttpClient, private socketService: SocketService, private localStorageService:LocalStorageService){
  }

  isLoggedIn(){
    const userData = localStorage.getItem('user');
    if(userData==null){
      return false
    }else{
      return true
    }
  }

  signin(data:any){
    return axios.post('/login', data);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/create`, userData);
  }
  

  signout(){
    this.localStorageService.clear()
    this.socketService.disconnect();
    return true
  }
  
}