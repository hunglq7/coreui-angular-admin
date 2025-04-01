import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Ba Lăng',
    },
    children: [
      {
        path: 'danhmucbalang',
        loadComponent: () =>
          import('./danhmucbalang/danhmucbalang.component').then(
            (m) => m.DanhmucbalangComponent
          ),
        data: {
          title: 'Danh mục ba lăng',
        },
      },
      {
        path: 'tonghopbalang',
        loadComponent: () =>
          import('./tonghopbalang/tonghopbalang.component').then(
            (m) => m.TonghopbalangComponent
          ),
        data: {
          title: 'Tổng hợp ba lăng',
        },
      },
    ],
  },
];
