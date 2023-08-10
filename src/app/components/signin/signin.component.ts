import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  loading: boolean = false;

  signInForm = this.formBuilder.group({
    username: ['', Validators.required], 
    password: ['', Validators.required], 
  });

  get username() { return this.signInForm.get('username'); }
  get password() { return this.signInForm.get('password'); }

  constructor(
    private electronService: ElectronService,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private authService: AuthService, 
    private localStorageService: LocalStorageService, 
  ) {}

  ngOnInit() {
    console.log('ngOnInit:',this.loading)
  }

  onSubmit(){
    
    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      if (this.signInForm.valid) {
        this.authService.signin(this.signInForm.value)
        .then(response => {
          console.log('Login successful!', response.data);
          this.localStorageService.setItem('user',response.data)
          this.router.navigate(['/main']);
        })
        .catch(error => {
          console.error('Login failed.', error);
          const messageData = { title: "Login",
                                message: "ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง!",
                                buttons: ['OK'],
                                navigateToNextPage: false};
  
          this.electronService.ipcRenderer.send("showMessageBox", messageData)
        });
      }else{
        const messageData = { title: "Login",
                              message: "กรุณากรอกข้อมูล ชื่อผู้ใช้งาน หรือรหัสผ่าน!",
                              buttons: ['OK'],
                              navigateToNextPage: false};
  
        this.electronService.ipcRenderer.send("showMessageBox", messageData)
      }
    }, 1500);
  }

}
