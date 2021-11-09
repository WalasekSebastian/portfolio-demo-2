import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { LoadingController } from '@ionic/angular';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogUpdateServiceService {

  constructor(public updates: SwUpdate, private loadingController: LoadingController) {
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
        .then(() => { }));
    }
  }

  public checkForUpdates(): void {
    this.updates.available.subscribe(event => {this.promptUser(); });
  }

  private promptUser(): void {
    this.updates.activateUpdate().then(() => {
      this.presentLoading('Aktualizacja aplikacji...', 4000);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  }

  async presentLoading(msg, dur) {
    const loading = await this.loadingController.create({
      message: msg,
      duration: dur
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }
}
