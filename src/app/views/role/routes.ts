import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Rơ le',
    },
    children: [
      {
        path: '',
        redirectTo: 'danhmucrole',
        pathMatch: 'full',
      },

      {
        path: 'danhmucrole',
        loadComponent: () =>
          import('./danhmucrole/danhmucrole.component').then(
            (m) => m.DanhmucroleComponent
          ),
        data: {
          title: 'Danh mục rơ le',
        },
      },
      {
        path: 'tonghoprole',
        loadComponent: () =>
          import('./tonghoprole/tonghoprole.component').then(
            (m) => m.TonghoproleComponent
          ),
        data: {
          title: 'Cập nhật rơ le',
        },
      },
    ],
  },
];
