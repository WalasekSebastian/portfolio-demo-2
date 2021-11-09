import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RejWork } from 'src/app/Models/rejWork';
import { InstallsService } from 'src/app/services/installs.service';
import { UsersService } from 'src/app/services/users.service';
import { WorksService } from 'src/app/services/works.service';

@Component({
  selector: 'app-work-edit',
  templateUrl: './work-edit.component.html',
  styleUrls: ['./work-edit.component.css']
})
export class WorkEditComponent implements OnInit {

  @Input() rejWorkId: number;
  @Output() newItemEvent = new EventEmitter<string>();

  basic: boolean;
  sizeModal;

  users = [];
  installs = [];

  form: FormGroup;

  dateFrom;
  dateTo;

  editRejWork: any;

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
      user: new FormControl('', Validators.required),
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
    this.getWork();
  }

  close(): void {
    this.form.reset();
    this.newItemEvent.emit('close');
    this.basic = false;
  }

  clearWorker(e): void {
    if (e) {
      this.form.get('user').reset();
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
    this.editRejWork.id = this.rejWorkId;
    this.editRejWork.userId = x.user.userId;
    this.editRejWork.installationId = x.install.id;
    this.editRejWork.dateStart = x.dateStart;
    this.editRejWork.dateStart = this.parse(x.dateStart, x.timeStart);
    if (x.dateEnd === '') {
      this.editRejWork.dateEnd = this.parse('01.01.1000', '00:00');
    }
    else {
      this.editRejWork.dateEnd = this.parse(x.dateEnd, x.timeEnd);
    }
    if (x.timetravel === '') {
      this.editRejWork.timeTravel = '00:00';
    }
    else {
      this.editRejWork.timeTravel = x.timeTravel;
    }
    this.editRejWork.description = x.desc;

    this.worksService.editWork(this.editRejWork).subscribe(() => {
      this.basic = false;
      this.form.reset();
      this.toastr.success('Zaktualizowano');
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

  getWork(): void {
    this.worksService.getWork(this.rejWorkId).subscribe((data) => {
      this.editRejWork = data;
      this.form = this.formBuilder.group({
        user: new FormControl(data.user, Validators.required),
        install: new FormControl(data.install, Validators.required),
        dateStart: new FormControl(this.editRejWork.dateStart, Validators.required),
        dateEnd: new FormControl(this.editRejWork.dateEnd),
        timeStart: new FormControl(this.editRejWork.timeStart, Validators.required),
        timeEnd: new FormControl(this.editRejWork.timeEnd),
        timeTravel: new FormControl(this.editRejWork.timeTravel),
        desc: new FormControl(this.editRejWork.description),
      });
    });
  }

}
