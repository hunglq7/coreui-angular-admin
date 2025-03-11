import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bơm nước',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopbomnuoc',
        pathMatch: 'full',
      },

      {
        path: 'tonghopbomnuoc',
        loadComponent: () =>
          import('./tonghopbomnuoc/tonghopbomnuoc.component').then(
            (m) => m.TonghopbomnuocComponent
          ),
        data: {
          title: 'Cập nhật bơm nước',
        },
      },
      {
        path: 'danhmucbomnuoc',
        loadComponent: () =>
          import('./danhmucbomnuoc/danhmucbomnuoc.component').then(
            (m) => m.DanhmucbomnuocComponent
          ),
        data: {
          title: 'Danh mục bơm nước',
        },
      },
      {
        path: 'thongsobomnuoc',
        loadComponent: () =>
          import('./thongsobomnuoc/thongsobomnuoc.component').then(
            (m) => m.ThongsobomnuocComponent
          ),
        data: {
          title: 'Thông số bơm nước',
        },
      },
    ],
  },
];
