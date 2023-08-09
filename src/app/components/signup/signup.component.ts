import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { OptionsService } from '../../services/options.service'
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  titleOptions: any[]=[];
  institutionOptions: any[]=[];

  signUpForm = this.formBuilder.group({
    username: ['', Validators.required], 
    password: ['', [Validators.required, Validators.minLength(6)]], 
    confirmPassword: ['', [Validators.required]],
    fname: ['', Validators.required], 
    lname: ['', Validators.required],
    image: '', 
    email: ['', [Validators.required, Validators.email]], 
    tel: ['', Validators.required],
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
  
  constructor(private formBuilder: FormBuilder, private optionsService:OptionsService, private router: Router, private authService: AuthService, ){
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
    if (this.signUpForm.valid) {
      const formData = this.signUpForm.value;
      this.authService.signup(formData)
      .subscribe(
        response => {
          console.log('Signup successful:', response);
          alert("สมัครสมาชิกสำเร็จ");
          this.router.navigate(['/main']);
        },
        error => {
          console.error('Signup error:', error);
          alert("สมัครสมาชิกไม่สำเร็จ");
        }
      );
    }else{
      console.log("signUpForm is invalid")
      alert("กรุณากรอกข้อมูลในช่องที่ต้องกรอกให้ถูกต้องทั้งหมด!");
    }
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
