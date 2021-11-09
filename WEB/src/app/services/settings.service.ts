import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../Models/unit';
import { GlobalVariable } from '../app-var';



@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  getAllUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.API_URL + 'settings/allunits', {headers: this.jwt()});
  }

  addUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.API_URL + 'settings/new', {
      name: unit.name,
      shortName: unit.shortName
    }, {headers: this.jwt()});
  }

  updateUnit(unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(this.API_URL + 'settings/unitUpdate', {
      id: unit.id,
      name: unit.name,
      shortName: unit.shortName
    }, {headers: this.jwt()});
  }

  getAlternative(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'settings/currentAltenative', {headers: this.jwt()});
  }

  changeAlternative(installId: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'settings/changeAlternative', {id: installId}, {headers: this.jwt()});
  }

  getWarehouse(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'settings/currentWarehouse', {headers: this.jwt()});
  }

  changeWarehouse(installId: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'settings/changeWarehouse', {id: installId}, {headers: this.jwt()});
  }

  getHDDInfo(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'settings/checkHddInfo', {headers: this.jwt()});
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
