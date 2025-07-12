import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Áp to mát & khởi động từ',
    },
    children: [
      {
        path: 'danhmucaptomatkhoidongtu',
        loadComponent: () =>
          import(
            './danhmucaptomatkhoidongtu/danhmucaptomatkhoidongtu.component'
          ).then((m) => m.DanhmucaptomatkhoidongtuComponent),
        data: {
          title: 'Danh mục áp to mát & khởi động từ',
        },
      },
    ],
  },
];
