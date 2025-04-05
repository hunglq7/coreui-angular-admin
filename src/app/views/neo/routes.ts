import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Thiết bị neo',
    },
    children: [
      {
        path: 'danhmucneo',
        loadComponent: () =>
          import('./danhmucneo/danhmucneo.component').then(
            (m) => m.DanhmucneoComponent
          ),
        data: {
          title: 'Danh mục neo',
        },
      },
      {
        path: 'thongsoneo',
        loadComponent: () =>
          import('./thongsoneo/thongsoneo.component').then(
            (m) => m.ThongsoneoComponent
          ),
        data: {
          title: 'Thông số kỹ thuật ',
        },
      },
      {
        path: 'tonghopneo',
        loadComponent: () =>
          import('./tonghopneo/tonghopneo.component').then(
            (m) => m.TonghopneoComponent
          ),
        data: {
          title: 'Tổng hợp neo',
        },
      },
    ],
  },
];
