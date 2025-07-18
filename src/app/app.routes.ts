import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Trang chủ',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
      },
      {
        path: 'toidien',
        loadChildren: () =>
          import('./views/Toidien/routes').then((m) => m.routes),
      },
      {
        path: 'mayxuc',
        loadChildren: () =>
          import('./views/mayxuc/routes').then((m) => m.routes),
      },
      {
        path: 'quatgio',
        loadChildren: () =>
          import('./views/quatgio/routes').then((m) => m.routes),
      },
      {
        path: 'bomnuoc',
        loadChildren: () =>
          import('./views/bomnuoc/routes').then((m) => m.routes),
      },
      {
        path: 'capdien',
        loadChildren: () =>
          import('./views/capdien/routes').then((m) => m.routes),
      },
      {
        path: 'role',
        loadChildren: () => import('./views/role/routes').then((m) => m.routes),
      },
      {
        path: 'bienap',
        loadChildren: () =>
          import('./views/Bienap/routes').then((m) => m.routes),
      },
      {
        path: 'balang',
        loadChildren: () =>
          import('./views/balang/routes').then((m) => m.routes),
      },
      {
        path: 'khoan',
        loadChildren: () =>
          import('./views/khoan/routes').then((m) => m.routes),
      },
      {
        path: 'maycao',
        loadChildren: () =>
          import('./views/maycao/routes').then((m) => m.routes),
      },
      {
        path: 'neo',
        loadChildren: () => import('./views/neo/routes').then((m) => m.routes),
      },
      {
        path: 'bangtai',
        loadChildren: () =>
          import('./views/bangtai/routes').then((m) => m.routes),
      },
      {
        path: 'aptomatkhoidongtu',
        loadChildren: () =>
          import('./views/aptomatkhoidongtu/routes').then((m) => m.routes),
      },
      {
        path: 'giacotthuyluc',
        loadChildren: () =>
          import('./views/giacotthuyluc/routes').then((m) => m.routes),
      },
      {
        path: 'danhmuc',
        loadChildren: () =>
          import('./views/danhmuc/routes').then((m) => m.routes),
      },
      {
        path: 'hethong',
        loadChildren: () =>
          import('./views/hethong/routes').then((m) => m.routes),
      },
      {
        path: 'tonghopmaytinh',
        loadChildren: () =>
          import('./views/tonghopmaytinh/routes').then((m) => m.routes),
      },
      {
        path: 'camera',
        loadChildren: () =>
          import('./views/camera/routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];
