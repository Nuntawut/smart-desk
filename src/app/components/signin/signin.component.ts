import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  signInForm = this.formBuilder.group({
    username: ['', Validators.required], 
    password: ['', Validators.required], 
  });

  get username() { return this.signInForm.get('username'); }
  get password() { return this.signInForm.get('password'); }

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private localStorageService: LocalStorageService, 
  ) {}

  onSubmit(){
    
    console.log(this.signInForm.value)

    if (this.signInForm.valid) {
      this.authService.signin(this.signInForm.value)
      .then(response => {
        console.log('Login successful!', response.data);
        this.localStorageService.setItem('user',response.data)
        this.router.navigate(['/main']);
      })
      .catch(error => {
        console.error('Login failed.', error);
        window.alert("Login failed.");
      });
    }else{
      window.alert("Form is invalid. Please fill in all required fields correctly.");
    }
    
  }

}
