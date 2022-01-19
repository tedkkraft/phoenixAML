import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {
  AbstractControl,
  AsyncValidator,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ThemePalette} from '@angular/material/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

let usernameRegex: RegExp = /^[a-zA-Z0-9\-_]{0,40}$/gm
export function checkUserName(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = !nameRe.test(control.value);
    return forbidden ? {forbiddenUserName: {value: control.value}} : null;
  };
}
export class UserAvailValidator implements AsyncValidator {
  constructor(private auth: AuthService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.auth.checkUserName(ctrl.value).pipe(
      map(data => (data['user_name_avail'] ? null : { unavailableUserName: true })),
      catchError(() => of(null))
    );
  }
}

let emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm
export function checkEmail(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = !nameRe.test(control.value);
    console.log("checkEmail forbidden: " + forbidden)
    return forbidden ? {forbiddenEmail: {value: control.value}} : null;
  };
}
export class EmailAvailValidator implements AsyncValidator {
  constructor(private auth: AuthService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.auth.checkEmail(ctrl.value).pipe(
      map(data => (data['email_avail'] ? null : { unavailableEmail: true })),
      catchError(() => of(null))
    );
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  durationInSeconds = 3
  linear = true
  emailFormGroup: FormGroup
  userNameFormGroup: FormGroup
  passwordFormGroup: FormGroup
  emailAsyncValidator: AsyncValidator
  userAsyncValidator: AsyncValidator

  constructor(public authService: AuthService, private router: Router,
              private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  openSnackBar() {
    this._snackBar.openFromComponent(RegisteredSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  register(email: string, username: string, password: string): boolean {
    this.authService.register(email, username, password).subscribe((data: any[])=>{
        console.log("register", data);
        this.authService.current_user = data['username'];
        this.authService.current_token = data['current_token'];
        this.openSnackBar()
      },
      (err: any[])=>{
        console.log("err ", err);
      },
      () => console.log('Registration HTTP request completed.'))

    this.router.navigate(['/login']);
    return false;
  }

  ngOnInit() {
    this.emailAsyncValidator  = new EmailAvailValidator(this.authService);
    this.emailFormGroup = this.fb.group({
      firstCtrl: [
        '',
        {
          validators: [
            Validators.required,
            checkEmail(emailRegex)
          ],
          asyncValidators: [this.emailAsyncValidator],
          updateOn: "change"
        }
      ]
    });

    this.userAsyncValidator  = new UserAvailValidator(this.authService);
    this.userNameFormGroup = this.fb.group({
      secondCtrl: ['',
        {
          validators: [
            Validators.required,
            checkUserName(usernameRegex)
          ],
          asyncValidators: [this.userAsyncValidator],
          updateOn: "blur"
        }
      ]
    });
    this.passwordFormGroup = this.fb.group({
      thirdCtrl: ['', [Validators.required]]
    });
  }

}

@Component({
  selector: 'snack-bar-registered',
  templateUrl: 'snack-bar-registered.html',
  styles: [`
    .snack-bar-registered {
      color: green;
    }
  `],
})
export class RegisteredSnackBarComponent {}
