import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';

import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
// tslint:disable-next-line:max-line-length
import { InstallationDownloadedItemsComponent } from './installations/installation-downloaded-items/installation-downloaded-items.component';
import { InstallationItemsComponent } from './installations/installation-items/installation-items.component';
import { InstallationListComponent } from './installations/installation-list/installation-list.component';
import { InstallationWorkComponent } from './installations/installation-work/installation-work.component';
import { InstallationsComponent } from './installations/installations/installations.component';
import { PhotosComponent } from './installations/photos/photos.component';
import { WorksInstallComponent } from './installations/works-install/works-install.component';
import { KierownikGuard } from './kierownik.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainViewComponent } from './main-view/main-view.component';
import { AllItemsActiveComponent } from './orders/all-items-active/all-items-active.component';
import { OrdersHistoryComponent } from './orders/orders-history/orders-history.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { AlternativeComponent } from './settings/alternative/alternative.component';
import { PasswordResetComponent } from './settings/password-reset/password-reset.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { UnitsComponent } from './settings/units/units.component';
import { WarehouseComponent } from './settings/warehouse/warehouse.component';
import { WorkAddComponent } from './workers/work-add/work-add.component';
import { WorkerAddComponent } from './workers/worker-add/worker-add.component';
import { WorkerHistoryComponent } from './workers/worker-history/worker-history.component';
import { WorkersListComponent } from './workers/workers-list/workers-list.component';
import { WorkersComponent } from './workers/workers/workers.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    pathMatch: 'full'
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
        path: 'workers',
        component: WorkersComponent,
        canActivate: [KierownikGuard],
        canActivateChild: [KierownikGuard],
        children: [
          {
            path: 'history',
            component: WorkerHistoryComponent
          },
          {
            path: 'list',
            component: WorkersListComponent
          },
          {
            path: '',
            redirectTo: 'history',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'installs',
        component: InstallationsComponent,
        children: [
          {
            path: 'list',
            component: InstallationListComponent
          },
          {
            path: 'items/:id',
            component: InstallationItemsComponent
          },
          {
            path: 'downloaded/:id',
            component: InstallationDownloadedItemsComponent
          },
          {
            path: 'workHistory/:id',
            component: InstallationWorkComponent,
            canActivate: [KierownikGuard]
          },
          {
            path: 'works',
            component: WorksInstallComponent,
            canActivate: [KierownikGuard]
          },
          {
            path: 'photos/:id',
            component: PhotosComponent
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: 'units',
            component: UnitsComponent,
            canActivate: [KierownikGuard]
          },
          {
            path: 'reset',
            component: PasswordResetComponent
          },
          {
            path: 'alternative',
            component: AlternativeComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'warehouse',
            component: WarehouseComponent,
            canActivate: [AdminGuard]
          }
        ]
      },
      {
        path: 'orders',
        component: OrdersComponent,
        children: [
          {
            path: 'list',
            component: OrdersListComponent
          },
          {
            path: 'history',
            component: OrdersHistoryComponent
          },
          {
            path: 'allactive',
            component: AllItemsActiveComponent
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
