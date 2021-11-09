import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from '../app-var';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private API_URL = GlobalVariable.API_URL;

  constructor(private http: HttpClient) { }

  getAllOrdersActive(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allActive', {headers: this.jwt()});
  }

  getAllOrdersConfirmed(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allConfirmed', {headers: this.jwt()});
  }

  getAllItemInOrder(orderID: number): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allitem/' + orderID, {headers: this.jwt()});
  }

  getAllStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allstatuses', {headers: this.jwt()});
  }

  getpriorityStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/priorityStatuses', {headers: this.jwt()});
  }

  getAllUnits(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL + 'orders/allunits', {headers: this.jwt()});
  }

  getOrderStatus(statusID: number): Observable<any> {
    return this.http.get<any>(this.API_URL + 'orders/statusoforder/' + statusID, {headers: this.jwt()});
  }

  getAllActiveItems(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'orders/allitemactive' , {headers: this.jwt()});
  }

  addOrder(instId: number, priority: number, date: any, itemlist: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'orders/add' , {
      installId: instId,
      items: itemlist,
      PriorityStatusId: priority,
      PriorityDate: date
    }, {headers: this.jwt()});
  }

  addItemsInOrder(instId: number, itemlist: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.API_URL + 'orders/additemsinorder' , {
      installId: instId,
      items: itemlist
    }, {headers: this.jwt()});
  }

  settledItems(instId: number, itemlist: any[]): Observable<any[]> {
    return this.http.put<any[]>(this.API_URL + 'orders/settled' , {
      installId: instId,
      items: itemlist
    }, {headers: this.jwt()});
  }

  statusUpdate(order: number, statusId: number): Observable<any> {
    return this.http.put<any>(this.API_URL + 'orders/statusupdate', {
      orderId: order,
      statusNewId: statusId
    }, {headers: this.jwt()});
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.put(this.API_URL + 'orders/remove', {Id: itemId}, {headers: this.jwt()});
  }

  changeItem(item: any): Observable<any> {
    return this.http.put(this.API_URL + 'orders/updateItem', {
      Id: item.id,
      Name: item.name,
      Qty: item.quantity,
      Unit: item.unitName
    }, {headers: this.jwt()});
  }

  divideItemQty(itemId: number, itemQty: number, itemQtyNew: number): Observable<any> {
    return this.http.put(this.API_URL + 'orders/divideqty', {Id: itemId, qty: itemQty, qtyNew: itemQtyNew}, {headers: this.jwt()});
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
