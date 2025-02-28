import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    name: 'Cập nhật thiết bị',
    title: true,
  },
  {
    name: 'Tời điện',
    url: '/toidien',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục tời điện',
        url: '/toidien/danhmuctoidien',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số kỹ thuật',
        url: '/toidien/thongsotoidien',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật tời điện',
        url: '/toidien/capnhattoidien',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Bơm nước',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Máy khoan',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Biến áp',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: '/forms/form-control',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Rơ le',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/charts',
  },
  {
    name: 'Khởi động từ',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      {
        name: 'CoreUI Free',
        url: '/icons/coreui-icons',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE',
        },
      },
    ],
  },
  {
    name: 'Cột thủy lực',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'nav-icon-bullet',
      },
    ],
  },

  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Hệ thống',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet',
      },
    ],
  },
];
