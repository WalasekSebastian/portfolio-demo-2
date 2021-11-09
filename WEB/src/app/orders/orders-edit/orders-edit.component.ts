import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.css']
})
export class OrdersEditComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @Input() orderId: number;
  @Input() installName: string;
  @Input() installId: number;

  dataItem = [];
  dataList = [];

  dataStatus = [];
  dataUnits = [];

  form: FormGroup;
  formChange: FormGroup;
  formDivide: FormGroup;

  status: number;
  statusBefore: number;

  basic: boolean;
  sizeModal;

  openChengeModal = false;
  openDivideQtyModal = false;
  changeItem: any;

  constructor(private ordersService: OrdersService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadItems();
    this.loadStatuses();
    this.loadStatusOrder();
    this.loadUnits();
    this.basic = true;
    this.sizeModal = 'lg';
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
      unit: ['', Validators.required]
    });
    this.formChange = this.formBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
      unit: ['', Validators.required]
    });
    this.formDivide = this.formBuilder.group({
      qty: ['', Validators.required],
      qtyNew: ['0', Validators.required],
    }, {
      validator: MustMatch('qty', 'qtyNew', 0)
    });
  }

  submit(): void {
    this.dataList.push(this.form.value);
    this.ordersService.addItemsInOrder(this.orderId, this.dataList).subscribe((data) => {
      this.dataList = [];
      this.form.reset();
      this.loadItems();
    });
  }

  remove(id: number): void {
    this.ordersService.removeItem(id).subscribe(() => {
      this.loadItems();
    });
  }

  close(): void {
    this.basic = false;
    this.newItemEvent.emit('close');
  }

  loadUnits(): void {
    this.ordersService.getAllUnits().subscribe((data) => {
      this.dataUnits = data;
    });
  }

  loadItems(): void {
    this.ordersService.getAllItemInOrder(this.orderId).subscribe((data) => {
      this.dataItem = data;
    });
  }

  loadStatuses(): void {
    this.ordersService.getAllStatuses().subscribe((data) => {
      this.dataStatus = data;
    });
  }

  loadStatusOrder(): void {
    this.ordersService.getOrderStatus(this.orderId).subscribe((data) => {
      this.status = data.statusId;
      this.statusBefore = data.statusId;
    });
  }

  update(): void {
    this.ordersService.statusUpdate(this.orderId, this.status).subscribe(() => {
      this.basic = false;
      this.newItemEvent.emit('true');
    },
      error => {
        this.newItemEvent.emit('false');
      });
  }

  changeOpen(item: any): void {
    this.changeItem = item;
    this.formChange = this.formBuilder.group({
      name: [this.changeItem.name, Validators.required],
      qty: [this.changeItem.quantity, Validators.required],
      unit: [this.changeItem.unitName, Validators.required]
    });
    this.openChengeModal = true;
  }

  submitChange(): void {
    const x = JSON.parse(JSON.stringify(this.formChange.value));
    this.changeItem.name = x.name;
    this.changeItem.quantity = x.qty;
    this.changeItem.unitName = x.unit;
    this.ordersService.changeItem(this.changeItem).subscribe(() => {
      this.openChengeModal = false;
      this.loadItems();
    });
  }

  divideQtyOpen(item: any): void {
    this.formDivide = this.formBuilder.group({
      qty: [item.quantity, Validators.required],
      qtyNew: ['0', Validators.required],
    }, {
      validator: MustMatch('qty', 'qtyNew', item.quantity)
    });
    this.changeItem = item;
    this.openDivideQtyModal = true;
  }

  submitDivide(): void {
    const x = JSON.parse(JSON.stringify(this.formDivide.value));
    this.ordersService.divideItemQty(this.changeItem.id, x.qty, x.qtyNew).subscribe(() => {
      this.openDivideQtyModal = false;
      this.loadItems();
    });
  }

  checkPermissions(): boolean {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      return false;
    }
  }


}

export function MustMatch(controlName: string, matchingControlName: string, sum: number): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    const x = control.value;
    const y = matchingControl.value;
    if ((x + y) !== sum ) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
