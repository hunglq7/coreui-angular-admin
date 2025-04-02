import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Máy cào',
    },
    children: [
      {
        path: 'danhmucmaycao',
        loadComponent: () =>
          import('./danhmucmaycao/danhmucmaycao.component').then(
            (m) => m.DanhmucmaycaoComponent
          ),
        data: {
          title: 'Danh mục máy cào',
        },
      },
      {
        path: 'thongsomaycao',
        loadComponent: () =>
          import('./thongsomaycao/thongsomaycao.component').then(
            (m) => m.ThongsomaycaoComponent
          ),
        data: {
          title: 'Thông số máy cào',
        },
      },
      {
        path: 'tonghopmaycao',
        loadComponent: () =>
          import('./tonghopmaycao/tonghopmaycao.component').then(
            (m) => m.TonghopmaycaoComponent
          ),
        data: {
          title: 'Tổng hợp máy cào',
        },
      },
    ],
  },
];
