import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Install } from 'src/app/Models/install';
import { InstallsService } from 'src/app/services/installs.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-oredrs-add',
  templateUrl: './oredrs-add.component.html',
  styleUrls: ['./oredrs-add.component.css']
})
export class OredrsAddComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @ViewChild('focus') inputElement: ElementRef;

  install = null;
  priorityStatus = null;
  priorityDate = null;
  unit = null;

  dataList = [];
  dataInstalls = [];
  dataUnits = [];
  dataPriorityStatus = [];

  form: FormGroup;
  formChange: FormGroup;

  basic: boolean;
  sizeModal;

  openChengeQtyModal = false;
  changeItem: any;

  constructor(
    private installService: InstallsService,
    private orderService: OrdersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
    ) {
    this.basic = true;
    this.sizeModal = 'lg';
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
      unit: ['', Validators.required]
    });
    this.formChange = this.formBuilder.group({
      qty: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadInstalls();
    this.loadUnits();
    this.loadPriorityStatus();
  }

  submit(): void {
    this.dataList.push(this.form.value);
    this.form.reset();
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    });
  }

  addOrder(): void {
    if (this.priorityDate === null) {
      this.priorityDate = '1000-01-01T00:00:00';
    }
    this.orderService.addOrder(this.install, this.priorityStatus, this.priorityDate, this.dataList).subscribe((data) => {
      this.basic = false;
      this.toastr.success('Dodano nowe zapotrzebowanie');
      this.newItemEvent.emit('true');
    },
    error => {
      this.toastr.error('Błąd dodania nowego zapotrzebowania');
      this.newItemEvent.emit('false');
    });
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('close');
  }

  loadInstalls(): void {
    this.installService.getAllActiveInstalls().subscribe((data) => {
      this.dataInstalls = data;
    });
  }

  loadUnits(): void {
    this.orderService.getAllUnits().subscribe((data) => {
      this.dataUnits = data;
    });
  }

  loadPriorityStatus(): void {
    this.orderService.getpriorityStatuses().subscribe((data) => {
      this.dataPriorityStatus = data;
    });
  }

  changeQtyOpen(item: any): void {
    this.changeItem = item;
    this.formChange = this.formBuilder.group({
      qty: [this.changeItem.qty, Validators.required]
    });
    this.openChengeQtyModal = true;
  }

  submitChange(): void {
    const x = JSON.parse(JSON.stringify(this.formChange.value));
    const index = this.dataList.indexOf(this.changeItem);
    this.changeItem.qty = x.qty;
    this.dataList[index] = this.changeItem;
    this.openChengeQtyModal = false;
  }

}
