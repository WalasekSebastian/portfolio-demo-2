import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './mainView/dashboard/dashboard.component';
import { MainViewComponent } from './main-view/main-view.component';
import { HttpClientModule } from '@angular/common/http';
import { RejHistoryComponent } from './rejWork/rej-history/rej-history.component';
import { AddWorkComponent } from './rejWork/add-work/add-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EditWorkComponent } from './rejWork/edit-work/edit-work.component';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { OrdersComponent } from './orders/orders/orders.component';
import { OrdersAddComponent } from './orders/orders-add/orders-add.component';
import { OrdersEditComponent } from './orders/orders-edit/orders-edit.component';
import { DownloadedComponent } from './items/downloaded/downloaded.component';
import { DownloadItemsComponent } from './items/download-items/download-items.component';
import { InstallAddComponent } from './mainView/install-add/install-add.component';
import { WorkersContactComponent } from './contacts/workers-contact/workers-contact.component';
import { InstallsContactComponent } from './contacts/installs-contact/installs-contact.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ListDownloadedComponent } from './items/list-downloaded/list-downloaded.component';
import { InInstallComponent } from './items/in-install/in-install.component';
import { ListInInstallComponent } from './items/list-in-install/list-in-install.component';
import { AddPhotoComponent } from './photos/add-photo/add-photo.component';
import { PhotosComponent } from './photos/photos/photos.component';
import { ListPhotosComponent } from './photos/list-photos/list-photos.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MoveItemComponent } from './items/move-item/move-item.component';
import { DownloadItemsModalComponent } from './items/download-items-modal/download-items-modal.component';

export function jwtOptionsFactory(storage): any {
  return {
    tokenGetter: () => {
      return localStorage.getItem('tokenJWT');
    },
    whitelistedDomains: ['*']
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardComponent,
    MainViewComponent,
    RejHistoryComponent,
    AddWorkComponent,
    EditWorkComponent,
    OrdersComponent,
    OrdersAddComponent,
    OrdersEditComponent,
    DownloadedComponent,
    DownloadItemsComponent,
    InstallAddComponent,
    WorkersContactComponent,
    InstallsContactComponent,
    ListDownloadedComponent,
    InInstallComponent,
    ListInInstallComponent,
    AddPhotoComponent,
    PhotosComponent,
    ListPhotosComponent,
    MoveItemComponent,
    DownloadItemsModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    Ng2ImgMaxModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
