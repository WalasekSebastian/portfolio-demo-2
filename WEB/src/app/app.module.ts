import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MainViewComponent } from './main-view/main-view.component';
import { WorkersComponent } from './workers/workers/workers.component';
import { WorkersListComponent } from './workers/workers-list/workers-list.component';
import { WorkerAddComponent } from './workers/worker-add/worker-add.component';
import { WorkerHistoryComponent } from './workers/worker-history/worker-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkerEditComponent } from './workers/worker-edit/worker-edit.component';
import { WorkersPasswordResetComponent } from './workers/workers-password-reset/workers-password-reset.component';
import { InstallationsComponent } from './installations/installations/installations.component';
import { InstallationListComponent } from './installations/installation-list/installation-list.component';
import { InstallationAddComponent } from './installations/installation-add/installation-add.component';
import { InstallationEditComponent } from './installations/installation-edit/installation-edit.component';
import '@angular/common/locales/global/pl';
import { SettingsComponent } from './settings/settings/settings.component';
import { UnitsComponent } from './settings/units/units.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersEditComponent } from './orders/orders-edit/orders-edit.component';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { OredrsAddComponent } from './orders/oredrs-add/oredrs-add.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import { InstallationItemsComponent } from './installations/installation-items/installation-items.component';
// tslint:disable-next-line:max-line-length
import { InstallationDownloadedItemsComponent } from './installations/installation-downloaded-items/installation-downloaded-items.component';
import { PasswordResetComponent } from './settings/password-reset/password-reset.component';
import { AlternativeComponent } from './settings/alternative/alternative.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AllItemsActiveComponent } from './orders/all-items-active/all-items-active.component';
import { DatePipe } from '@angular/common';
import { InstallationWorkComponent } from './installations/installation-work/installation-work.component';
import { PhotosComponent } from './installations/photos/photos.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ToastrModule } from 'ngx-toastr';
import { WorksInstallComponent } from './installations/works-install/works-install.component';
import { CdsModule } from '@cds/angular';

import '@cds/core/file/register.js';
import '@cds/core/time/register.js';

import { WorkAddComponent } from './workers/work-add/work-add.component';
import { WorkEditComponent } from './workers/work-edit/work-edit.component';
import { RemoveWorkComponent } from './workers/remove-work/remove-work.component';
import { WarehouseComponent } from './settings/warehouse/warehouse.component';

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
    MainViewComponent,
    WorkersComponent,
    WorkersListComponent,
    WorkerAddComponent,
    WorkerHistoryComponent,
    WorkerEditComponent,
    WorkersPasswordResetComponent,
    InstallationsComponent,
    InstallationListComponent,
    InstallationAddComponent,
    InstallationEditComponent,
    SettingsComponent,
    UnitsComponent,
    OrdersComponent,
    OrdersListComponent,
    OrdersEditComponent,
    OredrsAddComponent,
    OrdersHistoryComponent,
    InstallationItemsComponent,
    InstallationDownloadedItemsComponent,
    PasswordResetComponent,
    AlternativeComponent,
    DashboardComponent,
    AllItemsActiveComponent,
    InstallationWorkComponent,
    PhotosComponent,
    WorksInstallComponent,
    WorkAddComponent,
    WorkEditComponent,
    RemoveWorkComponent,
    WarehouseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2ImgMaxModule,
    CdsModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-bottom-center',
      timeOut: 4000
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pl-PL' }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
