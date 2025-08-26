import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpBackend } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, Observable, throwError, timeout, catchError } from 'rxjs';
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
    
    const token = this.authenService.accessToken;
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    
    console.log('Making GET request to:', this.baseUrl + uri);
    console.log('Headers:', headers);
    
    return this.http.get(this.baseUrl + uri, {
      headers: headers,
    }).pipe(
      timeout(30000), // 30 second timeout
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('DataService error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      if (error.error && error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    console.error('Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: errorMessage,
      url: error.url,
      error: error.error
    });
    
    return throwError(() => error);
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
