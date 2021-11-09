import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RejWork } from '../Models/rejWork';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  private API_URL = environment.API_URL;

  login = localStorage.getItem('login');
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getUserWorkHistory(): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'rejwork/userHistoryMobile', {login: this.login, token: this.token}, {headers: this.jwt()});
  }

  getUserWorks(datefrom: Date, dateTo: Date): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'rejwork/userHistoryMobileDate', {
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  getUserWorksSummary(datefrom: Date, dateTo: Date): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/userWorksSummaryMobile', {
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  getUserWork(workid: number): Observable<RejWork> {
    return this.http.post<any>(this.API_URL + 'rejwork/userWork', {id: workid}, {headers: this.jwt()});
  }

  getUserSummary(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'rejwork/userWorksSummaryMobile', {headers: this.jwt()});
  }

  addUserWork(work: RejWork): Observable<any> {
    return this.http.post(this.API_URL + 'rejwork/new', {
      installationId: work.installationId,
      dateStart: work.dateStart,
      dateEnd: work.dateEnd,
      timeTravel: work.timeTravel,
      description: work.description
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  updateUserWork(work: RejWork): Observable<any> {
    return this.http.put(this.API_URL + 'rejwork/update', {
      id: work.id,
      installationId: work.installationId,
      dateStart: work.dateStart,
      dateEnd: work.dateEnd,
      timeTravel: work.timeTravel,
      description: work.description
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
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
