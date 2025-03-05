import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Trang chủ',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'Home',
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
    name: 'Quạt gió',
    url: '/quatgio',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục quạt gió',
        url: '/quatgio/danhmucquatgio',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số quạt gió',
        url: '/quatgio/thongsoquatgio',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật quạt gió',
        url: '/quatgio/tonghopquatgio',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Máy xuc',
    url: '/mayxuc',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục máy xúc',
        url: '/mayxuc/danhmucmayxuc',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số máy xúc',
        url: '/mayxuc/thongsomayxuc',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật máy xúc',
        url: '/mayxuc/tonghopmayxuc',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Biến áp',
    url: '/forms',
    iconComponent: { name: 'cil-puzzle' },
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
    iconComponent: { name: 'cil-puzzle' },
    url: '/charts',
  },
  {
    name: 'Khởi động từ',
    iconComponent: { name: 'cil-puzzle' },
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
    iconComponent: { name: 'cil-puzzle' },
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
    name: 'Cài đặt',
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
