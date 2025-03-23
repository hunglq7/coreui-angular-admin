import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cáp điện',
    },
    children: [
      {
        path: '',
        redirectTo: 'danhmuccapdien',
        pathMatch: 'full',
      },

      {
        path: 'danhmuccapdien',
        loadComponent: () =>
          import('./danhmuccapdien/danhmuccapdien.component').then(
            (m) => m.DanhmuccapdienComponent
          ),
        data: {
          title: 'Danh mục cáp điện',
        },
      },
      {
        path: 'tonghopcapdien',
        loadComponent: () =>
          import('./tonghopcapdien/tonghopcapdien.component').then(
            (m) => m.TonghopcapdienComponent
          ),
        data: {
          title: 'Cập nhật cáp điện',
        },
      },
    ],
  },
];
