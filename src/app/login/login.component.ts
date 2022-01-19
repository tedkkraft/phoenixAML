import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from  '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string;
  token: string;

  constructor(public authService: AuthService, private router: Router, fb: FormBuilder) {
    this.loginForm = fb.group({
      'user':  [''],
      'password': ['']
    });

    this.loginForm.valueChanges.subscribe(
      (form: any) => {
        console.log('form has been changed');
      }
    );
  }

  login(): boolean {
    const formData = new FormData();
    formData.append('username', this.loginForm.get('user').value);
    formData.append('password', this.loginForm.get('password').value);

    this.authService.login(formData).subscribe(
      (data: any[])=>{
        this.authService.current_token = data['access_token'];
        this.authService.current_user = formData.get('username');
        this.router.navigate(['/home']);
      },
      (error: any[])=>{
        console.log('auth.login: ', error)
        console.log(formData)
      }
    );
    return false;
  }
}
