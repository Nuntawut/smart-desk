import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { OptionsService } from '../../services/options.service'
import {AuthService} from '../../auth/auth.service';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  titleOptions: any[]=[];
  institutionOptions: any[]=[];

  loading: boolean = false;

  signUpForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]], 
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)[A-Za-z\\d]+$')]], 
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    fname: ['', Validators.required], 
    lname: ['', Validators.required],
    image: '', 
    email: ['', [Validators.required, Validators.email]], 
    tel: ['', [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
    title_id: ['', Validators.required],
    institution_id: ['', Validators.required],
  },
  { validator: this.passwordMatchValidator });

  get username() { return this.signUpForm.get('username'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
  get fname() { return this.signUpForm.get('fname'); }
  get lname() { return this.signUpForm.get('lname'); }
  get email() { return this.signUpForm.get('email'); }
  get tel() { return this.signUpForm.get('tel'); }
  get title_id() { return this.signUpForm.get('title_id'); }
  get institution_id() { return this.signUpForm.get('institution_id'); }
  
  constructor(
    private electronService: ElectronService, 
    private formBuilder: FormBuilder, 
    private optionsService:OptionsService, 
    private router: Router, 
    private authService: AuthService, ){}

  ngOnInit() {

    this.loading = false;

    this.optionsService.fetchTitleOptions()
      .then(options => {
        this.titleOptions = options.data;
      })
      .catch(error => {
        console.error('Error fetching options:', error);
      });

      this.optionsService.fetchInstitutionOptions()
      .then(options => {
        this.institutionOptions = options.data;
      })
      .catch(error => {
        console.error('Error fetching options:', error);
      });
  }

  onSubmit(){
    
    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      if (this.signUpForm.valid) {
        console.log("signUpForm is valid")
  
        const formData = this.signUpForm.value;
  
        this.authService.signup(formData)
          .then(response => {
            const messageData = { title: "Signup",
                                  message: "สมัครสมาชิกสำเร็จ",
                                  buttons: ['OK'],
                                  navigateToNextPage: true};
  
            this.electronService.ipcRenderer.send("showMessageBox", messageData)
           
            this.electronService.ipcRenderer.on('resMessageBox', (event, data) => {
              this.router.navigate(['/signin']);
            });
          })
          .catch(error => {
            console.error('Signup failed.', error);
            const messageData = {title: "Signup",
                                  message: "สมัครสมาชิกไม่สำเร็จ เนื่องจากชื่อผู้ใช้นี้อยู่แล้ว!",
                                  buttons: ['OK'],
                                  navigateToNextPage: false};
            this.electronService.ipcRenderer.send("showMessageBox", messageData)
          });
      }else{
        console.log("signUpForm is invalid")
        const messageData = {title: "Signup",
                                  message: "กรุณากรอกข้อมูลในช่องที่ต้องกรอกให้ถูกต้องทั้งหมด!!",
                                  buttons: ['OK'],
                                  navigateToNextPage: false};
        this.electronService.ipcRenderer.send("showMessageBox",messageData)
      }
    },1500);

    
  }

  // Custom password match validator
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

}
