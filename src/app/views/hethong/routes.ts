import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Hệ thống',
    },
    children: [
      {
        path: '',
        redirectTo: 'taikhoan',
        pathMatch: 'full',
      },

      {
        path: 'taikhoan',
        loadComponent: () =>
          import('./taikhoan/taikhoan.component').then(
            (m) => m.TaikhoanComponent
          ),
        data: {
          title: 'Cập nhật tài khoản',
        },
      },
      {
        path: 'quyen',
        loadComponent: () =>
          import('./quyen/quyen.component').then(
            (m) => m.QuyenComponent
          ),
        data: {
          title: 'Cập nhật quyền',
        },
      },

      {
        path: 'phanquyen',
        loadComponent: () =>
          import('./phanquyen/phanquyen.component').then(
            (m) => m.PhanquyenComponent
          ),
        data: {
          title: 'Phân quyền',
        },
      },
     
    ],
  },
];
