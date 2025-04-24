import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tổng hợp camera',
    },
    children: [
      {
        path: '',
        redirectTo: 'tonghopcamera',
        pathMatch: 'full',
      },
      {
        path: 'tonghopcamera',
        loadComponent: () =>
          import('./capnhatcamera/capnhatcamera.component').then(
            (m) => m.CapnhatcameraComponent
          ),
        data: {
          title: 'Cập nhật camera',
        },
      },
      {
        path: 'danhmuccamera',
        loadComponent: () =>
          import('./danhmuccamera/danhmuccamera.component').then(
            (m) => m.DanhmuccameraComponent
          ),
        data: {
          title: 'Danh mục Camera',
        },
      },
      {
        path: 'nhatkycamera',
        loadComponent: () =>
          import('./nhatkycamera/nhatkycamera.component').then(
            (m) => m.NhatkycameraComponent
          ),
        data: {
          title: 'Nhật ký camera',
        },
      },
    ],
  },
];
