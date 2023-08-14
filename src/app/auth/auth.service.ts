import { Injectable } from '@angular/core';
import axios from 'axios';
import { LocalStorageService } from '../services/local-storage.service';
import { SocketService } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private socketService: SocketService, private localStorageService:LocalStorageService){
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
    return axios.post('/user/login', data);
  }

  getProfile(token: string){
    return axios.get('/user/profile', {headers: {Authorization: token}})
  }

  updateProfileImage(imageData: string, token: string) {

    const requestBody = { imageData };

    return axios.put('/user/update-img', requestBody, {headers: {Authorization: token}})
  }

  signup(data:any){
    return axios.post('/user/create', data);
  }

  signout(){
    this.localStorageService.clear()
    this.socketService.disconnect();
    return true
  }
  
}
