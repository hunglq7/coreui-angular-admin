import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Đơn vị tính',
    },
    children: [
      {
        path: '',
        redirectTo: 'donvitinh',
        pathMatch: 'full',
      },

      {
        path: 'donvitinh',
        loadComponent: () =>
          import('./danhmucdonvitinh/danhmucdonvitinh.component').then(
            (m) => m.DanhmucdonvitinhComponent
          ),
        data: {
          title: 'Cập nhật đơn vị tính',
        },
      },
      {
        path: 'loaithietbi',
        loadComponent: () =>
          import('./danhmucloaithietbi/danhmucloaithietbi.component').then(
            (m) => m.DanhmucloaithietbiComponent
          ),
        data: {
          title: 'Cập nhật loại thiết bị',
        },
      },
      {
        path: 'donvi',
        loadComponent: () =>
          import('./danhmucdonvi/danhmucdonvi.component').then(
            (m) => m.DanhmucdonviComponent
          ),
        data: {
          title: 'Cập nhật đơn vị',
        },
      },
      {
        path: 'chucvu',
        loadComponent: () =>
          import('./danhmucchucvu/danhmucchucvu.component').then(
            (m) => m.DanhmucchucvuComponent
          ),
        data: {
          title: 'Cập nhật chức vụ',
        },
      },
     
    ],
  },
];
