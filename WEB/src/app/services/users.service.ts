import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserSimply } from '../Models/user';
import { catchError, tap } from 'rxjs/operators';
import { GlobalVariable } from '../app-var';



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  AllUsers(active): Observable<User[]> {
    const formData = new FormData();
    formData.append('activeOnly', active);
    return this.http.post<User[]>(this.API_URL + 'users/all', formData, {headers: this.jwt()});
  }

  getAllUsersSimply(): Observable<UserSimply[]> {
    return this.http.get<UserSimply[]>(this.API_URL + 'users/allUsersSimply', {headers: this.jwt()});
  }

  getUser(userId: number): Observable<User> {
    return this.http.post<User>(this.API_URL + 'users/user', {Id: userId}, {headers: this.jwt()});
  }

  getUserRateWork(userId: number): Observable<any> {
    return this.http.post<any>(this.API_URL + 'users/userRateWork', {Id: userId}, {headers: this.jwt()});
  }

  public updateUserRateWork(
    id: number,
    std: number,
    alter: number,
    stdHoli: number,
    alterHoli: number,
    ovrStd: number,
    ovrStdHoli: number,
    ovrAlter: number,
    ovrAlterHoli: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'users/updateUserRateWork', {
      userId: id,
      rateStd: std,
      rateAlter: alter,
      rateStdHoliday: stdHoli,
      rateAlterHoliday: alterHoli,
      overtimeStd: ovrStd,
      overtimeStdHoliday: ovrStdHoli,
      overtimeAlter: ovrAlter,
      overtimeAlterHoliday: ovrAlterHoli
    }, {headers: this.jwt()});
  }

  addUserRateWork(
    id: number,
    std: number,
    alter: number,
    stdHoli: number,
    alterHoli: number,
    ovrStd: number,
    ovrStdHoli: number,
    ovrAlter: number,
    ovrAlterHoli: number): Observable<any> {
    return this.http.post<any>(this.API_URL + 'users/addUserRateWork', {
      userId: id,
      rateStd: std,
      rateAlter: alter,
      rateStdHoliday: stdHoli,
      rateAlterHoliday: alterHoli,
      overtimeStd: ovrStd,
      overtimeStdHoliday: ovrStdHoli,
      overtimeAlter: ovrAlter,
      overtimeAlterHoliday: ovrAlterHoli
    }, {headers: this.jwt()});
  }

  deactivateUser(userId: number): Observable<any> {
    return this.http.put(this.API_URL + 'users/deactivate', {Id: userId}, {headers: this.jwt()});
  }

  activateUser(userId: number): Observable<any> {
    return this.http.put(this.API_URL + 'users/activate', {Id: userId}, {headers: this.jwt()});
  }

  addUser(user: User): Observable<any> {
    return this.http.post(this.API_URL + 'users/new', {
      login: user.login,
      password: user.password,
      isAdmin: user.isAdmin,
      active: user.active,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      notificationsSMS: user.notificationsSMS
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.API_URL + 'users/update', {
      id: user.id,
      login: user.login,
      isAdmin: user.isAdmin,
      active: user.active,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      notificationsSMS: user.notificationsSMS
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  resetPassword(user: User): Observable<any> {
    return this.http.put(this.API_URL + 'users/resetpassword', {
      id: user.id,
      password: user.password
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  selfResetPassword(old: string, newP: string): Observable<any> {
    return this.http.put(this.API_URL + 'users/selfResetPassword', {
      oldPassword: old,
      newPassword: newP
    }, {headers: this.jwt()});
  }

  private jwt(): HttpHeaders {
    // create authorization header with jwt token
    if (localStorage.getItem('tokenJWT')) {
        return new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('tokenJWT'),
          login: localStorage.getItem('login'),
          userToken: localStorage.getItem('token')
        });
    }
  }

}
