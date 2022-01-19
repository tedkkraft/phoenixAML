import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  current_user = null;
  current_token;
  api_prefix = 'api/v1'

  constructor(private http: HttpClient) {}

  //login(user: string, password: string): any {
  login(formData: FormData): any {
    let queryURL = environment.phoenixApiURL + '/token';
    const httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });


    return this.http.post<any>(queryURL, formData)
  }

  register(email: string, userName: string, password: string) {
    const body = {
      email: email['firstCtrl'],
      username: userName['secondCtrl'],
      password: password['thirdCtrl']
    };
    const httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*'});
    let queryURL = environment.phoenixApiURL + '/register';
    console.log("queryURL " + queryURL)
    console.log(body.email['firstCtrl'])
    console.log(body.username['secondCtrl'])
    console.log(body.password['thirdCtrl'])
    console.log("headers " + httpHeaders)
    return this.http.post<any>(queryURL, body, {headers: httpHeaders});
  }

  logout(): any {
    this.current_user = null;
    this.current_token = null;
  }

  getUser(): any {
    //console.log('auth.getUser[this.current_user]: ', this.current_user);
    return this.current_user;
  }

  getCurrentToken(): any {
    return this.current_token;
  }

  isLoggedIn(): boolean {
    //console.log("isLoggedIn()" + this.current_user);
    return this.current_user !== null;
  }

  checkUserName(userName: string) {
    const body = {
      username: userName
    };
    let queryURL = environment.phoenixApiURL + '/checkuser';
    const httpHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*'});
    return this.http.post<any>(queryURL, body, {headers: httpHeaders});
  }

  checkEmail(email: string) {
    console.log('checkEmail, email', email);
    const body = {
      email: email
    };
    console.log('checkEmail, body', body);
    let queryURL = environment.phoenixApiURL + '/checkemail';
    const httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(queryURL, body, {headers: httpHeaders});
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
