import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'toidien',
    },
    children: [
      {
        path: '',
        redirectTo: 'danhmuctoidien',
        pathMatch: 'full',
      },

      {
        path: 'danhmuctoidien',
        loadComponent: () =>
          import('./danhmuctoidien/danhmuctoidien.component').then(
            (m) => m.DanhmuctoidienComponent
          ),
        data: {
          title: 'Danh mục tời điện',
        },
      },
      {
        path: 'capnhattoidien',
        loadComponent: () =>
          import('./capnhattoidien/capnhattoidien.component').then(
            (m) => m.CapnhattoidienComponent
          ),
        data: {
          title: 'Cập nhật tời điện',
        },
      },
      {
        path: 'thongsotoidien',
        loadComponent: () =>
          import(
            './thongsokythuattoidien/thongsokythuattoidien.component'
          ).then((m) => m.ThongsokythuattoidienComponent),
        data: {
          title: 'Cập nhật thông số tời điện',
        },
      },
    ],
  },
];
