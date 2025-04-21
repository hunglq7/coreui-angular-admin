import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NzButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  model: any = {};
  loginLoading: boolean = false;
  form!: FormGroup;
  message!: string;
  loginSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.initFormBuilder();
  }
  ngOnInit() {}

  loginUser() {
    this.loginLoading = true;
    this.authService
      .loginWithUserCredentials(this.form.value.email, this.form.value.password)
      .subscribe({
        next: (data: any) => {
          this.router.navigate(['dashboard']);
        },
        error: () => {
          this.toastr.error('Tên đăng nhập hoặc mật khẩu không đúng');
        },
      });
  }

  private initFormBuilder() {
    this.form = new FormGroup({
      email: new FormControl({ value: null, disabled: false }),
      password: new FormControl({ value: null, disabled: false }),
    });
  }
}
