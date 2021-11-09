import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserWorks } from '../Models/user';
import { GlobalVariable } from '../app-var';
import { RejWork } from '../Models/rejWork';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WorksService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  getUserWorks(userId: number, datefrom: Date, dateTo: Date): Observable<UserWorks[]> {
    return this.http.post<UserWorks[]>(this.API_URL + 'rejwork/userDetailWorks', {
      UserId: userId,
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  getUserWorksAdmin(userId: number, datefrom: Date, dateTo: Date): Observable<UserWorks[]> {
    return this.http.post<UserWorks[]>(this.API_URL + 'rejwork/userDetailWorksAdmin', {
      UserId: userId,
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  getInstallWorks(install: number, datefrom: Date, dateTo: Date): Observable<UserWorks[]> {
    return this.http.post<UserWorks[]>(this.API_URL + 'rejwork/installDetailWorks', {
      InstallId: install,
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  bonusWork(rejId: number, userId: number, value: number, desc: string): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/userBonus', {
      RejWorkId: rejId,
      UserId: userId,
      Value: value,
      Description: desc,
    }, {headers: this.jwt()});
  }

  lastUsersWorks(): Observable<UserWorks[]> {
    return this.http.get<UserWorks[]>(this.API_URL + 'rejwork/lastUsersWorks', {headers: this.jwt()});
  }

  getUserSummary(userId: number, datefrom: Date, dateTo: Date): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/userWorksSummary', {
      UserId: userId,
      DateFrom: datefrom,
      DateTo: dateTo,
    }, {headers: this.jwt()});
  }

  addWork(work: RejWork): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/add', {
      UserId: work.userId,
      InstallationId: work.installationId,
      DateStart: work.dateStart,
      DateEnd: work.dateEnd,
      TimeTravel: work.timeTravel,
      Description: work.description
    }, { headers: this.jwt() })
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  addWorkForUser(work: RejWork): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/addforUser', {
      InstallationId: work.installationId,
      DateStart: work.dateStart,
      DateEnd: work.dateEnd,
      TimeTravel: work.timeTravel,
      Description: work.description
    }, { headers: this.jwt() })
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  editWork(work: RejWork): Observable<any> {
    return this.http.post<any>(this.API_URL + 'rejwork/edit', {
      Id: work.id,
      UserId: work.userId,
      InstallationId: work.installationId,
      DateStart: work.dateStart,
      DateEnd: work.dateEnd,
      TimeTravel: work.timeTravel,
      Description: work.description
    }, { headers: this.jwt() })
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  removeWork(work: RejWork): Observable<any> {
    return this.http.put<any>(this.API_URL + 'rejwork/removeWork', {
      Id: work.id,
      UserId: work.userId,
      InstallationId: work.installationId,
      DateStart: work.dateStart,
      DateEnd: work.dateEnd,
      TimeTravel: work.timeTravel,
      Description: work.description
    }, {headers: this.jwt()});
  }

  getWork(rejId: any): Observable<any> {
    const formData = new FormData();
    formData.append('rejWorkId', rejId);
    return this.http.post<any>(this.API_URL + 'rejwork/work', formData, {headers: this.jwt()});
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
