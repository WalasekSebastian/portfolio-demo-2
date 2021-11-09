import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { InstallationService } from 'src/app/services/installation.service';
import { DownloadItemsModalComponent } from '../download-items-modal/download-items-modal.component';
import { MoveItemComponent } from '../move-item/move-item.component';

@Component({
  selector: 'app-list-in-install',
  templateUrl: './list-in-install.component.html',
  styleUrls: ['./list-in-install.component.scss'],
})
export class ListInInstallComponent implements OnInit {

  private sub: any;
  installId: number;
  installName: string;

  filterTerm: string;

  dataItems = [];

  constructor(
    private routerParams: ActivatedRoute,
    private installService: InstallationService,
    public modalController: ModalController) { }

  ngOnInit() {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.loadItems();
    });
  }

  loadItems() {
    this.installService.getAllItemsInInstall(this.installId).subscribe((data) => {
      this.dataItems = data.items;
      this.installName = data.installName;
    });
  }

  async showMove(i) {
    const modal = await this.modalController.create({
      component: MoveItemComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        item: i
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.dismissed === true) {
      this.loadItems();
    }
  }

  async showDownload(i) {
    const modal = await this.modalController.create({
      component: DownloadItemsModalComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        item: i,
        installId: this.installId
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.dismissed === true) {
      this.loadItems();
    }
  }

}
