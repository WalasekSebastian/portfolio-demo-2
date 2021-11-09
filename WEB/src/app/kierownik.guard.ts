import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KierownikGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {
    // this.checkToken();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      this.router.navigate(['/mv']);
      return false;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if ((localStorage.getItem('isAdmin') === '8') || (localStorage.getItem('isAdmin') === '10')) {
      return true;
    }
    else {
      this.router.navigate(['/mv']);
      return false;
    }
  }

}
