import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { InstallsContactComponent } from './contacts/installs-contact/installs-contact.component';
import { WorkersContactComponent } from './contacts/workers-contact/workers-contact.component';
import { DownloadItemsComponent } from './items/download-items/download-items.component';
import { DownloadedComponent } from './items/downloaded/downloaded.component';
import { InInstallComponent } from './items/in-install/in-install.component';
import { ListDownloadedComponent } from './items/list-downloaded/list-downloaded.component';
import { ListInInstallComponent } from './items/list-in-install/list-in-install.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainViewComponent } from './main-view/main-view.component';
import { DashboardComponent } from './mainView/dashboard/dashboard.component';
import { InstallAddComponent } from './mainView/install-add/install-add.component';
import { OrdersAddComponent } from './orders/orders-add/orders-add.component';
import { OrdersEditComponent } from './orders/orders-edit/orders-edit.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { AddPhotoComponent } from './photos/add-photo/add-photo.component';
import { ListPhotosComponent } from './photos/list-photos/list-photos.component';
import { PhotosComponent } from './photos/photos/photos.component';
import { AddWorkComponent } from './rejWork/add-work/add-work.component';
import { EditWorkComponent } from './rejWork/edit-work/edit-work.component';
import { RejHistoryComponent } from './rejWork/rej-history/rej-history.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'mv',
    component: MainViewComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'installAdd',
        component: InstallAddComponent
      },
      {
        path: 'WorkHistory',
        component: RejHistoryComponent
      },
      {
        path: 'AddWork',
        component: AddWorkComponent
      },
      {
        path: 'EditWork/:id',
        component: EditWorkComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'ordersAdd',
        component: OrdersAddComponent
      },
      {
        path: 'ordersEdit/:id',
        component: OrdersEditComponent
      },
      {
        path: 'downloaded',
        component: DownloadedComponent
      },
      {
        path: 'listDownloaded/:id',
        component: ListDownloadedComponent
      },
      {
        path: 'inInstall',
        component: InInstallComponent
      },
      {
        path: 'listInInstall/:id',
        component: ListInInstallComponent
      },
      {
        path: 'downloadItems',
        component: DownloadItemsComponent
      },
      {
        path: 'workersContact',
        component: WorkersContactComponent
      },
      {
        path: 'installsContact',
        component: InstallsContactComponent
      },
      {
        path: 'addphoto',
        component: AddPhotoComponent
      },
      {
        path: 'photos',
        component: PhotosComponent
      },
      {
        path: 'listPhotos/:id',
        component: ListPhotosComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
