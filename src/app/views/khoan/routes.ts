import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Khoan',
    },
    children: [
      {
        path: 'danhmuckhoan',
        loadComponent: () =>
          import('./danhmuckhoan/danhmuckhoan.component').then(
            (m) => m.DanhmuckhoanComponent
          ),
        data: {
          title: 'Danh mục khoan',
        },
      },
      {
        path: 'tonghopkhoan',
        loadComponent: () =>
          import('./tonghopkhoan/tonghopkhoan.component').then(
            (m) => m.TonghopkhoanComponent
          ),
        data: {
          title: 'Tổng hợp khoan',
        },
      },
    ],
  },
];
