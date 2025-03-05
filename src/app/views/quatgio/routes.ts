import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quạt gió',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopquatgio',
        pathMatch: 'full',
      },

      {
        path: 'tonghopquatgio',
        loadComponent: () =>
          import('./tonghopquatgio/tonghopquatgio.component').then(
            (m) => m.TonghopquatgioComponent
          ),
        data: {
          title: 'Cập nhật quạt gió',
        },
      },
      {
        path: 'danhmucquatgio',
        loadComponent: () =>
          import('./danhmucquatgio/danhmucquatgio.component').then(
            (m) => m.DanhmucquatgioComponent
          ),
        data: {
          title: 'Danh mục quạt gió',
        },
      },
      {
        path: 'thongsoquatgio',
        loadComponent: () =>
          import('./thongsoquatgio/thongsoquatgio.component').then(
            (m) => m.ThongsoquatgioComponent
          ),
        data: {
          title: 'Thông số quạt gió',
        },
      },
    ],
  },
];
