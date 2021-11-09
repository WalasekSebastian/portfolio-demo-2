import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorksService } from 'src/app/services/works.service';

@Component({
  selector: 'app-remove-work',
  templateUrl: './remove-work.component.html',
  styleUrls: ['./remove-work.component.css']
})
export class RemoveWorkComponent implements OnInit {

  @Input() rejWorkId: number;
  @Output() newItemEvent = new EventEmitter<string>();

  basic: boolean;
  sizeModal;

  rejWork: any;

  constructor(
    private worksService: WorksService,
    private toastr: ToastrService
  ) {
    this.basic = true;
    this.sizeModal = 'md';
   }

  ngOnInit(): void {
    this.getWork();
  }

  close(): void {
    this.newItemEvent.emit('close');
    this.basic = false;
  }

  getWork(): void {
    this.worksService.getWork(this.rejWorkId).subscribe((data) => {
      this.rejWork = data;
    });
  }

  submit(): void {
    this.worksService.removeWork(this.rejWork).subscribe(() => {
      this.basic = false;
      this.toastr.warning('Skasowano wpis pracy');
      this.newItemEvent.emit('true');
    }, error => {
      this.basic = false;
      this.toastr.error('Błąd aktualizacji');
      this.newItemEvent.emit('err');
    });
  }

}
