import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBackend, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl: string = environment.BASE_API;
  constructor(private http: HttpClient, public authenService: AuthService) {}

  get(uri: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );
    //let params = new HttpParams();
    return this.http.get(this.baseUrl + uri, {
      headers: headers,
    });
  }

  getById(uri: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );

    return this.http
      .get(`${this.baseUrl}${uri}`, {
        headers: headers,
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  delete(uri: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );
    // Let's going to mock a backend response,because there is no API available for delete
    return this.http.delete(`${this.baseUrl}${uri}`, {
      headers: headers,
    });
  }
  deleteMultiple(uri: string, data: any[]): Observable<any[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );
    return this.http.post<any[]>(`${this.baseUrl}${uri}`, data, {
      headers: headers,
    });
  }
  put(uri: string, data: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );
    return this.http.put(`${this.baseUrl}${uri}`, data, { headers: headers });
  }

  post(uri: string, data: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8 ');
    headers = headers.set(
      'Authorization',
      'Bearer ' + this.authenService.accessToken
    );
    return this.http.post(`${this.baseUrl}${uri}`, data, { headers: headers });
  }
}
