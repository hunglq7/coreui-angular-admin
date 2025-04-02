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
    ],
  },
];
