import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Biến áp',
    },
    children: [
      {
        path: '',
        redirectTo: 'danhmucbienap',
        pathMatch: 'full',
      },

      {
        path: 'danhmucbienap',
        loadComponent: () =>
          import('./danhmucbienap/danhmucbienap.component').then(
            (m) => m.DanhmucbienapComponent
          ),
        data: {
          title: 'Danh mục biến áp',
        },
      },
      {
        path: 'thongsobienap',
        loadComponent: () =>
          import('./thongsobienap/thongsobienap.component').then(
            (m) => m.ThongsobienapComponent
          ),
        data: {
          title: 'Thông số biến áp',
        },
      },
    ],
  },
];
