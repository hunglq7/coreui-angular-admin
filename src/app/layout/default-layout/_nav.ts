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
    name: 'Bơm nước',
    url: '/bomnuoc',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục bơm nước',
        url: '/bomnuoc/danhmucbomnuoc',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số bơm nước',
        url: '/bomnuoc/thongsobomnuoc',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật bơm nước',
        url: '/bomnuoc/tonghopbomnuoc',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Cáp điện',
    url: '/capdien',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục cáp điện',
        url: '/capdien/danhmuccapdien',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tổng hợp cáp điện',
        url: '/capdien/tonghopcapdien',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Ba lăng',
    url: '/balang',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục ba lăng',
        url: '/balang/danhmucbalang',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tổng hợp ba lăng',
        url: '/balang/tonghopbalang',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Khoan',
    url: '/khoan',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục khoan',
        url: '/khoan/danhmuckhoan',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tổng hợp khoan',
        url: '/khoan/tonghopkhoan',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Máy cào',
    url: '/maycao',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục máy cào',
        url: '/maycao/danhmucmaycao',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số máy cào',
        url: '/maycao/thongsomaycao',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tổng hợp máy cào',
        url: '/maycao/tonghopmaycao',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Thiết bị neo',
    url: '/neo',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục neo',
        url: '/neo/danhmucneo',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số kỹ thuật',
        url: '/neo/thongsoneo',
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
    name: 'Cập nhật danh mục',
    title: true,
  },
  {
    name: 'Danh mục',
    url: '/danhmuc',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Đơn vị tính',
        url: '/danhmuc/donvitinh',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Loại thiết bị',
        url: '/danhmuc/loaithietbi',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Đơn vị',
        url: '/danhmuc/donvi',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Chức vụ',
        url: '/danhmuc/chucvu',
        icon: 'nav-icon-bullet',
      },
    ],
  },

  {
    title: true,
    name: 'Hệ thống',
  },
  {
    name: 'Tài khoản',
    url: '/hethong',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Tài khoản đăng nhập',
        url: '/hethong/taikhoan',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Quyền',
        url: '/hethong/quyen',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Phân quyền',
        url: '/hethong/phanquyen',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    title: true,
    name: 'Cài đặt',
  },
  {
    name: 'Đăng nhập',
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
