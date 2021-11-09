import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Install } from '../Models/install';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allActive', {headers: this.jwt()});
  }

  getAllUnits(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allunits', {headers: this.jwt()});
  }

  getInstallByOrderId(orderIdId: number): Observable<Install> {
    return this.http.post<Install>(this.API_URL + 'orders/install', {
      id: orderIdId
    }, {headers: this.jwt()});
  }

  getOrderStatus(statusID: number): Observable<any> {
    return this.http.get<any>(this.API_URL + 'orders/statusoforder/' + statusID, {headers: this.jwt()});
  }

  getAllItemInOrder(orderID: number): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allitem/' + orderID, {headers: this.jwt()});
  }

  addOrder(instId: number, priority: number, date, itemlist: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'orders/add' , {
      installId: instId,
      items: itemlist,
      PriorityStatusId: priority,
      PriorityDate: date
    }, {headers: this.jwt()});
  }

  addDownloaded(instId: number, na: string, q: number, u: string): Observable<any> {
    return this.http.post<any>(this.API_URL + 'orders/getitemdownload' , {
      installId: instId,
      name: na,
      qty: q,
      unit: u
    }, {headers: this.jwt()});
  }

  getpriorityStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/priorityStatuses', {headers: this.jwt()});
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.put(this.API_URL + 'orders/remove', {Id: itemId}, {headers: this.jwt()});
  }

  confirmItem(itemId: number): Observable<any> {
    return this.http.put(this.API_URL + 'orders/confirmitem', {Id: itemId}, {headers: this.jwt()});
  }

  moveToWarehouseItem(itemId: number): Observable<any> {
    return this.http.put(this.API_URL + 'orders/movetowarehouseitem', {Id: itemId}, {headers: this.jwt()});
  }

  addItemsInOrder(orderId: number, itemlist: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'orders/additemsinorder' , {
      installId: orderId,
      items: itemlist
    }, {headers: this.jwt()});
  }

  changeItem(item: any): Observable<any> {
    return this.http.put(this.API_URL + 'orders/changeItemMobile', {
      Id: item.id,
      Name: item.name,
      Quantity: item.quantity
    }, { headers: this.jwt() });
  }

  statusUpdate(order: number, statusId: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'orders/statusupdate', {
      orderId: order,
      statusNewId: statusId
    }, {headers: this.jwt()});
  }

  itemMove(itemId: number, qtyItem: number, install: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'orders/moveItem', {
      Id: itemId,
      Qty: qtyItem,
      InstallId: install
    }, {headers: this.jwt()});
  }

  deleteOrder(orderId): Observable<any> {
    const formData = new FormData();
    formData.append('orderId', orderId);
    return this.http.post(this.API_URL + 'orders/deleteorder', formData, { headers: this.jwt() })
    .pipe(
      tap(res => {
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  private jwt(): HttpHeaders {
    // create authorization header with jwt token
    if (localStorage.getItem('tokenJWT')) {
        return new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('tokenJWT'),
          login: localStorage.getItem('login'),
          userToken: localStorage.getItem('token')
        });
    }
  }
}
