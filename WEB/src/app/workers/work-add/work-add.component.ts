import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RejWork } from 'src/app/Models/rejWork';
import { InstallsService } from 'src/app/services/installs.service';
import { UsersService } from 'src/app/services/users.service';
import { WorksService } from 'src/app/services/works.service';

@Component({
  selector: 'app-work-add',
  templateUrl: './work-add.component.html',
  styleUrls: ['./work-add.component.css']
})
export class WorkAddComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();

  basic: boolean;
  sizeModal;

  users = [];
  installs = [];

  form: FormGroup;

  dateFrom;
  dateTo;

  newRejWork = {} as RejWork;

  constructor(
    private userService: UsersService,
    private installService: InstallsService,
    private worksService: WorksService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.basic = true;
    this.sizeModal = 'md';
    this.form = this.formBuilder.group({
      worker: new FormControl('', Validators.required),
      install: new FormControl('', Validators.required),
      dateStart: new FormControl('', Validators.required),
      dateEnd: new FormControl(''),
      timeStart: new FormControl('07:00', Validators.required),
      timeEnd: new FormControl('15:00'),
      timeTravel: new FormControl('00:00'),
      desc: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadInstalls();
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('false');
  }

  clearWorker(e): void {
    if (e) {
      this.form.get('worker').reset();
    }
  }

  clearInstall(e): void {
    if (e) {
      this.form.get('install').reset();
    }
  }

  loadUsers(): void {
    this.userService.getAllUsersSimply().subscribe((data) => {
      this.users = data;
    });
  }

  loadInstalls(): void {
    this.installService.getAllInstalls().subscribe((data) => {
      this.installs = data;
    });
  }

  submit(): void {
    const x = JSON.parse(JSON.stringify(this.form.value));

    this.newRejWork.userId = x.worker.userId;
    this.newRejWork.installationId = x.install.id;
    this.newRejWork.dateStart = x.dateStart;
    this.newRejWork.dateStart = this.parse(x.dateStart, x.timeStart);
    if (x.dateEnd === '') {
      this.newRejWork.dateEnd = this.parse('01.01.1000', '00:00');
    }
    else {
      this.newRejWork.dateEnd = this.parse(x.dateEnd, x.timeEnd);
    }
    if (x.timetravel === '') {
      this.newRejWork.timeTravel = '00:00';
    }
    else {
      this.newRejWork.timeTravel = x.timeTravel;
    }
    this.newRejWork.description = x.desc;

    this.worksService.addWork(this.newRejWork).subscribe(() => {
      this.basic = false;
      this.toastr.success('Dodano');
      this.newItemEvent.emit('true');
    }, (error) => {
      if (error.error === 'exist') {
        this.toastr.warning('Istnieje rejestracja w tym czasie');
      }
      else {
        this.toastr.error('Błąd dodania');
      }
    });
  }

  parse(value: any, time: any): Date | null {
    if ((typeof value === 'string') && (value.includes('.'))) {
      const str = value.split('.');
      const tm = time.split(':');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      const houer = Number(tm[0]) + 2;
      const minute = Number(tm[1]);

      return new Date(year, month, date, houer, minute);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

}
