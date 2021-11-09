import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild,  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  authenticationState = new BehaviorSubject(false);

  constructor(private router: Router, private helper: JwtHelperService) {
    // this.checkToken();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkToken()) {
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkToken()) {
      return true;
    }
    else {
      this.router.navigate(['/']);
      return false;
    }
  }

  checkToken(): boolean {
    const token = localStorage.getItem('tokenJWT');
    if (localStorage.getItem('tokenJWT')) {
      let isExpired;
      try {
        isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          this.authenticationState.next(true);
          return true;
        }
        else {
          this.authenticationState.next(false);
          this.logout();
          return false;
        }
      }
      catch {
        this.authenticationState.next(false);
        this.logout();
        return false;
      }
    } else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('isAdmin');
  }
}
