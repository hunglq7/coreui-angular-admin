import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Băng tải',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopbangtai',
        pathMatch: 'full',
      },

      {
        path: 'danhmucbangtai',
        loadComponent: () =>
          import('./danhmucbangtai/danhmucbangtai.component').then(
            (m) => m.DanhmucbangtaiComponent
          ),
        data: {
          title: 'Danh mục băng tải',
        },
      },
    ],
  },
];
