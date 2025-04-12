import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tổng hợp máy tính',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopmaytinh',
        pathMatch: 'full',
      },
      {
        path: 'tonghopmaytinh',
        loadComponent: () =>
          import('./tonghopmaytinh.component').then(
            (m) => m.TonghopmaytinhComponent
          ),
        data: {
          title: 'Tổng hợp máy tính',
        },
      },
    ],
  },
];
