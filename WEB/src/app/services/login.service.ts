import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../app-var';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  login(login: string, passowrd: string): Observable<any> {
    const url = `${this.API_URL}login`;
    return this.http.post<any>(url, {Login: login, Password: passowrd});
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('isAdmin');
}
}
