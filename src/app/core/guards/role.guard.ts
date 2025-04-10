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
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const role = route.data['roles'] as string;
    const roles = this.auth.getroles();

    if (!this.auth.isLogged() || roles !== 'admin') {
      this.toastr.error(
        'Bạn không có quyền truy cập vào trức năng này',
        'Error'
      );
      // alert('Bạn không có quyền truy cập vào trức năng này');
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    return true;
  }
}
