import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiLogin = 'http://localhost:6060/api';
  private apiUser = 'http://localhost:6060/api/user';
  private apicreate = 'http://localhost:6060/api/auth';
  

  constructor(private http: HttpClient) {}

  postUserName(user: any): Observable<any> {
    const token = localStorage.getItem('authToken'); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.http.post(`${this.apiUser}/addUser`, user, httpOptions);
  }
  
  getUsers(): Observable<any> {
    const token = localStorage.getItem('authToken'); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.http.get(`${this.apiUser}/showAllUsers`, httpOptions);
  }

  getPositions(): Observable<any> {
    return this.http.get(`${this.apiUser}/position`);
  }
  
  putUser(data:any, id : number) {
    return this.http.put<any>(`${this.apiUser}/updateUser/{id}`+id, data)
  }

  login(user: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(`${this.apiLogin}/login`, user, httpOptions);
  }
  
  register(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${this.apicreate}/create`, user, httpOptions);
  }

}