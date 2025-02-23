import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../interface/login-request';
import { jwtDecode } from 'jwt-decode';
import { SystemConstants } from '../commons/system.constants';
import { HttpApi } from '../http/http-api';
import { inject } from '@angular/core';
const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = SystemConstants.BASE_API;
  http:HttpClient=inject(HttpClient);
  constructor( ) {
    
  }

  register(userRequest: any): Observable<any> {
    const data = {
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      userName: userRequest.userName,
      email: userRequest.email,
      password: userRequest.password,
    };

    return this.http.post(`${this.baseUrl}/api/Users`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  loginWithUserCredentials(email: string, password: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    var data: LoginRequest = {
      eMail: email,
      passWord: password,
    };
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', OAUTH_DATA.client_id);
    body.set('client_secret', OAUTH_DATA.client_secret);
    body.set('email', email);
    body.set('password', password);
    body.set('scope', OAUTH_DATA.scope);

    return this.http.post(`${this.baseUrl}/api/Users/authenticate`, data).pipe(
      map((response: any) => {
        localStorage.setItem('session', JSON.stringify(response));
        return response;
      })
    );
  }

  loginWithRefreshToken(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', OAUTH_DATA.client_id);
    body.set('client_secret', OAUTH_DATA.client_secret);
    body.set('refresh_token', this.refreshToken);
    body.set('scope', OAUTH_DATA.scope);

    return this.http.post(HttpApi.oauthLogin, body, { headers }).pipe(
      map((response: any) => {
        localStorage.removeItem('session');
        localStorage.setItem('session', JSON.stringify(response));
        return response;
      })
    );
  }

  isLogged(): boolean {
    return localStorage.getItem('session') ? true : false;
  }

  logout(): void {
    localStorage.clear();
  }

  get accessToken() {
    return localStorage['session']
      ? JSON.parse(localStorage['session']).resultObj
      : null;
  }

  get refreshToken() {
    return localStorage['session']
      ? JSON.parse(localStorage['session']).refresh_token
      : null;
  }

  Token() {
    return localStorage['session']
      ? JSON.parse(localStorage['session']).resultObj
      : null;
  }

  getUsserDetail() {
    const token = this.Token();

    if (!token) return true;
    const decodeToken: any = jwtDecode(token);

    const userDetail = {
      fullName: decodeToken.fullName,
      mail: decodeToken.mail,
      name: decodeToken.name,
    };
    return userDetail;
  }

  getroles() {
    const token = this.Token();
    if (!token) null;
    const decodeToken: any = jwtDecode(token);
    return decodeToken.role;
  }
}
