import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.auth.getroles();

    if (!this.auth.isLogged()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (!userRole) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(userRole)) {
      alert('Bạn không có quyền truy cập vào chức năng này');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
