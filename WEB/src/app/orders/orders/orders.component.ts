import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  toogle: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addOrder(): void {
    this.toogle = true;
  }

  addOrderClose(added: string): void {
    if (added === 'true') {
      if (this.router.url === '/mv/orders/list') {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }
      this.toogle = false;
    }
    else if (added === 'false') {
      this.toogle = false;
    }
    else if (added === 'close') {
      this.toogle = false;
    }
  }

}
