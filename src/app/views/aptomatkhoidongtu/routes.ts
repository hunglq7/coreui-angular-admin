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
      {
        path: 'thongsoaptomatkhoidongtu',
        loadComponent: () =>
          import(
            './thongsoaptomatkhoidongtu/thongsoaptomatkhoidongtu.component'
          ).then((m) => m.ThongsoaptomatkhoidongtuComponent),
        data: {
          title: 'Thông số áp to mát & khởi động từ',
        },
      },
      {
        path: 'tonghopaptomatkhoidongtu',
        loadComponent: () =>
          import(
            './tonghopaptomatkhoidongtu/tonghopaptomatkhoidongtu.component'
          ).then((m) => m.TonghopaptomatkhoidongtuComponent),
        data: {
          title: 'Cập nhật áp to mát & khởi động từ',
        },
      },
    ],
  },
];
