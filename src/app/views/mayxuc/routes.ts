import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Máy xúc',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopmayxuc',
        pathMatch: 'full',
      },

      {
        path: 'tonghopmayxuc',
        loadComponent: () =>
          import('./tonghopmayxuc/tonghopmayxuc.component').then(
            (m) => m.TonghopmayxucComponent
          ),
        data: {
          title: 'Cập nhật máy xúc',
        },
      },
      {
        path: 'danhmucmayxuc',
        loadComponent: () =>
          import('./danhmucmayxuc/danhmucmayxuc.component').then(
            (m) => m.DanhmucmayxucComponent
          ),
        data: {
          title: 'Danh mục máy xúc',
        },
      },
      {
        path: 'thongsomayxuc',
        loadComponent: () =>
          import('./thongsomayxuc/thongsomayxuc.component').then(
            (m) => m.ThongsomayxucComponent
          ),
        data: {
          title: 'Thông số máy xúc',
        },
      },
    ],
  },
];
