import { Component } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service'
import { ScoreService} from '../../services/score.service';
import {AuthService} from '../../auth/auth.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userData: any;
  userProfile: any = {};
  userScore: any = {};

  userImg = {
    profileImageBase64: ''
  };

  selectedImage: File | null = null;
  hovering = false; // Add this line to declare the hovering property

  constructor(
    private authService:AuthService,
    private localStorageService: LocalStorageService,
    private scoreService:ScoreService
  ) {}

  ngOnInit(): void {

    this.userData = this.localStorageService.getItem('user');

    if (this.userData) {
      
      this.authService.getProfile(this.userData.token)
        .then(response => {
          this.userProfile = response.data;
        })
        .catch(error => {
          console.log('Access denied:', error);
        });

      this.scoreService.getUserStat(this.userData.token)
        .then(response => {
          this.userScore = response.data;
        })
        .catch(error => {
          console.log('Access denied:', error);
        });
    }
  }

  handleImageInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImg.profileImageBase64 = e.target.result;
        
          this.authService.updateProfileImage(e.target.result, this.userData.token)
           .then(response => {
             console.log('Image updated successfully', response);
           })
           .catch(error => {
             console.log('Access denied:', error);
           });
        };
      reader.readAsDataURL(file);
    }
  }
}
