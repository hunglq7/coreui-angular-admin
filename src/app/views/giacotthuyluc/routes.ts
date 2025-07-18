import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Giá, Cột thủy lực',
    },
    children: [
      {
        path: 'danhmucgiacotthuyluc',
        loadComponent: () =>
          import('./danhmucgiacotthuyluc/danhmucgiacotthuyluc.component').then(
            (m) => m.DanhmucgiacotthuylucComponent
          ),
        data: {
          title: 'Danh mục giá, cột thủy lực',
        },
      },
      {
        path: 'tonghopgiacotthuyluc',
        loadComponent: () =>
          import('./tonghopgiacotthuyluc/tonghopgiacotthuyluc.component').then(
            (m) => m.TonghopgiacotthuylucComponent
          ),
        data: {
          title: 'Tổng hợp giá & Cột thủy thực',
        },
      },
    ],
  },
];
