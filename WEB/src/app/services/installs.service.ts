import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Install, InstallWithContacts } from '../Models/install';
import { catchError, tap } from 'rxjs/operators';
import { GlobalVariable } from '../app-var';


@Injectable({
  providedIn: 'root'
})
export class InstallsService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  getAllInstalls(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'installation/all', {headers: this.jwt()});
  }

  getName(InstallId): Observable<any> {
    const formData = new FormData();
    formData.append('id', InstallId);
    return this.http.post<any>(this.API_URL + 'installation/installName', formData, {headers: this.jwt()});
  }

  AllInstallsWithContatcs(active): Observable<any[]> {
    const formData = new FormData();
    formData.append('activeOnly', active);
    return this.http.post<any[]>(this.API_URL + 'installation/allWithContacts', formData, {headers: this.jwt()});
  }

  getAllActiveInstalls(): Observable<Install[]> {
    return this.http.get<Install[]>(this.API_URL + 'installation/allActive', {headers: this.jwt()});
  }

  getInstall(installId: number): Observable<Install> {
    return this.http.post<Install>(this.API_URL + 'installation/inst', {Id: installId}, {headers: this.jwt()});
  }

  getAllItemsInInstall(installId: number): Observable<any> {
    return this.http.get<any>(this.API_URL + 'orders/allitemsininstallation/' + installId, {headers: this.jwt()});
  }

  getAllWorksInInstall(installId: number): Observable<any> {
    return this.http.get<any>(this.API_URL + 'rejwork/worksininstall/' + installId, {headers: this.jwt()});
  }

  getAllDownloadedItemsInInstall(installId, settleded): Observable<any> {
    const formData = new FormData();
    formData.append('id', installId);
    formData.append('settled', settleded);
    return this.http.post<any>(this.API_URL + 'orders/allitemsininstallationdownloaded/', formData, {headers: this.jwt()});
  }

  deactivateInstall(installId: number): Observable<any> {
    return this.http.put(this.API_URL + 'installation/deactivate', {Id: installId}, {headers: this.jwt()});
  }

  activateInstall(installId: number): Observable<any> {
    return this.http.put(this.API_URL + 'installation/activate', {Id: installId}, {headers: this.jwt()});
  }

  addInstall(install: InstallWithContacts): Observable<any> {
    return this.http.post(this.API_URL + 'installation/newWithContacts', {
      name: install.name,
      firstName: install.firstName,
      lastName: install.lastName,
      email: install.email,
      phone: install.phone,
      street: install.street,
      number: install.number,
      postalCode: install.postalCode,
      city: install.city,
      active: install.active,
      contacts: install.contacts
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  updateInstall(install: Install): Observable<any> {
    return this.http.put(this.API_URL + 'installation/update', {
      id: install.id,
      name: install.name,
      firstName: install.firstName,
      lastName: install.lastName,
      email: install.email,
      phone: install.phone,
      street: install.street,
      number: install.number,
      postalCode: install.postalCode,
      city: install.city,
      active: install.active
    }, {headers: this.jwt()})
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  getAllContacts(installId: number): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/getallcontacts', {Id: installId}, {headers: this.jwt()});
  }

  addContact(id: number, nameCont: string, phoneCont: string, emailCont: string): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/addcontact', {
      installId: id,
      name: nameCont,
      phone: phoneCont,
      email: emailCont
    }, {headers: this.jwt()});
  }

  updateContact(contId: number, inId: number, nameCont: string, phoneCont: string, emailCont: string): Observable<any> {
    return this.http.put<any>(this.API_URL + 'installation/updatecontact', {
      id: contId,
      installId: inId,
      name: nameCont,
      phone: phoneCont,
      email: emailCont
    }, {headers: this.jwt()});
  }

  deactivateContact(contactId: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'installation/deactivatecontact', {
      id: contactId,
    }, {headers: this.jwt()});
  }

  uploadPhoto(install, desc, images): Observable<any> {
    const formData = new FormData();

    if (images !== 'K' && images !== 'O') {
      formData.append('InstallId', install);
      formData.append('desc', desc);
      formData.append('file', images);
    }

    return this.http.post(this.API_URL + 'installation/addPhoto', formData, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('tokenJWT'),
        login: localStorage.getItem('login'),
        userToken: localStorage.getItem('token'),
        enctype: 'multipart/form-data;'
      })
    })
      .pipe(
        tap(res => {
        }),
        catchError(e => {
          throw new Error(e);
        })
      );
  }

  getPhotoList(installId): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/getPhotosFromInstall', { id: installId }, { headers: this.jwt() })
      .pipe(
        catchError(e => {
          throw new Error(e);
        })
      );
  }

  getPhoto(photoId): Observable<any> {
    return this.http.post(this.API_URL + 'installation/getPhotos', { id: photoId }, { headers: this.jwt(), responseType: 'blob' })
      .pipe(
        catchError(e => {
          throw new Error(e);
        })
      );
  }

  removePhoto(photoId: number): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/removePhoto', { id: photoId}, { headers: this.jwt() });
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
