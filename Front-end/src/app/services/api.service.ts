import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError} from 'rxjs';
import { User } from '../interfaces/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Position, Users } from '../interfaces/userModel';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiLogin = 'http://localhost:6060/api';
  private apiUser = 'http://localhost:6060/api/user'; 
  private apicreate = 'http://localhost:6060/api/auth';
  private apiPostion = 'http://localhost:6060/api/position';
  private userSubject = new BehaviorSubject<string | null>(null);
  user$: Observable<string | null> = this.userSubject.asObservable();
  

  constructor(private http: HttpClient, private cookieService: CookieService) {}
  // USER
  // ADD
  postUserName(user: Users): Observable<Users> {
    const token = this.cookieService.get('authToken'); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.post<Users>(`${this.apiUser}/addUser`, user, httpOptions);
  }
  // GET ALL
  getUsers(): Observable<Users[]> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.get<Users[]>(`${this.apiUser}/showAllUsers`, httpOptions)
    .pipe(
      catchError((error: any) => {
        console.error('Error fetching users:', error);
        return throwError(error); 
      })
    );
  }
  // UPDATE
  putUser(data: any, id: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUser}/updateUser/${id}`, data, httpOptions)
    .pipe(
      catchError((error: any) => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }
  // DELETED USER ID 
  deleteUser(id: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.delete(`${this.apiUser}/deleteByID/${id}`, httpOptions)
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting user:', error);
          return throwError(error);
        })
      );
  }

  // POSITON 
  // ADD
  addPosition(positionData: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.post(`${this.apiPostion}/addPosition`, positionData, httpOptions);
  }
  // GET ALL POSITON
  getAllPositions(): Observable<Position[]> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.get<Position[]>(`${this.apiPostion}/all`, httpOptions)
    .pipe(
      catchError((error: any) => {
        console.error('Error fetching positions:', error);
        return throwError(error); 
      })
    );
  }
  // UPDATE
  updatePosition(id: string, positionData: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
    return this.http.put(`${this.apiPostion}/updatePosition/${id}`, positionData, httpOptions);
  }

  // USER SERVICES
  // REGISTER USER
  register(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${this.apicreate}/create`, user, httpOptions);
  }
  //LOGIN USER
  login(user: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };

    return this.http.post<any>(`${this.apiLogin}/login`, user, httpOptions).pipe(
      tap((res: any) => {
        console.log('Login response:', res); 
        if (res && res.jwt) { 
          this.cookieService.set('authToken', res.jwt, { path: '/' });
          console.log('Token saved to cookies:', res.jwt); 
          this.userSubject.next(user.userName);
        } else {
          console.error('JWT not found in response:', res);
        }
      })
    );
  }

  //LOGOUT USER
  logout(): void {
    this.cookieService.delete('authToken', '/');
    this.userSubject.next(null);
  }

  //CHANGED PASSWORD SERVICE
  changePassword(changePasswordDTO: any): Observable<any> {
    return this.http.post(`${this.apicreate}/change-password`, changePasswordDTO);
  }
}