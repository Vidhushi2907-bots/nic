import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeedDivisionGuard implements CanActivate {
  userData: any;
  constructor(
    private router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userData && this.userData.user_type == 'SD' || this.userData.user_type == 'OILSEEDADMIN' || this.userData.user_type == 'PULSESSEEDADMIN' || this.userData.user_type == 'SUPERADMIN') {
      return true;
    }
    this.router.navigate(['web-login']);
    return false;
  }

}
