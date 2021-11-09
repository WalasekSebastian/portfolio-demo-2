import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstallationService } from 'src/app/services/installation.service';

@Component({
  selector: 'app-list-downloaded',
  templateUrl: './list-downloaded.component.html',
  styleUrls: ['./list-downloaded.component.scss'],
})
export class ListDownloadedComponent implements OnInit {

  private sub: any;
  installId: number;
  installName: string;

  dataItems = [];

  constructor(private routerParams: ActivatedRoute, private installService: InstallationService) { }

  ngOnInit() {
    this.sub = this.routerParams.params.subscribe(params => {
      this.installId = +params.id;
      this.installService.getAllDownloadedItemsInInstall(this.installId, false).subscribe((data) => {
        this.dataItems = data.items;
        this.installName = data.installName;
      });
    });
  }

}
