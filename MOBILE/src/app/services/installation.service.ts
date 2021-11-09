import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Install } from '../Models/install';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InstallationService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, public toastController: ToastController) { }

  getAllInstalls(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'installation/allActive', { headers: this.jwt() });
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'installation/contactsMobile', { headers: this.jwt() });
  }

  getAllActiveInstalls(): Observable<Install[]> {
    return this.http.get<Install[]>(this.API_URL + 'installation/allActive', { headers: this.jwt() });
  }

  getAllActiveDownloaded(): Observable<Install[]> {
    return this.http.get<Install[]>(this.API_URL + 'installation/allInstallDownloaded', { headers: this.jwt() });
  }

  getAllActiveInstallsIninstall(): Observable<Install[]> {
    return this.http.get<Install[]>(this.API_URL + 'installation/allInstallInItems', { headers: this.jwt() });
  }

  getInstallation(installId: number): Observable<Install> {
    return this.http.post<Install>(this.API_URL + 'installation/inst', {
      id: installId
    }, { headers: this.jwt() });
  }

  getAllDownloadedItemsInInstall(installId, settleded): Observable<any> {
    const formData = new FormData();
    formData.append('id', installId);
    formData.append('settled', settleded);
    return this.http.post<any>(this.API_URL + 'orders/allitemsininstallationdownloaded/', formData, {headers: this.jwt()});
  }

  getAllItemsInInstall(installId: number): Observable<any> {
    return this.http.get<any>(this.API_URL + 'orders/allitemsininstallation/' + installId, { headers: this.jwt() });
  }

  addInstall(install: Install): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/new', {
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
    }, { headers: this.jwt() })
      .pipe(
        tap(res => {
        }),
        catchError(e => {
          return throwError(e);
        })
      );
  }

  uploadPhoto(install, desc, images) {
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
          this.presentToast('Dodano zdjęcia', 3000, 'success');
        }),
        catchError(e => {
          this.presentToast('Błąd zapisu', 5000, 'danger');
          throw new Error(e);
        })
      );
  }

  getPhotoList(installId): Observable<any> {
    return this.http.post<any>(this.API_URL + 'installation/getPhotosFromInstall', { id: installId }, { headers: this.jwt() })
      .pipe(
        catchError(e => {
          this.presentToast('Błąd przy pobieraniu listy zdjęć', 5000, 'danger');
          throw new Error(e);
        })
      );
  }

  getPhoto(photoId): Observable<any> {
    return this.http.post(this.API_URL + 'installation/getPhotos', { id: photoId }, { headers: this.jwt(), responseType: 'blob' })
      .pipe(
        catchError(e => {
          this.presentToast('Błąd przy pobieraniu zdjęcia', 5000, 'danger');
          throw new Error(e);
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

  async presentToast(msg: string, dur: number, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
      color: col
    });
    toast.present();
  }
}
