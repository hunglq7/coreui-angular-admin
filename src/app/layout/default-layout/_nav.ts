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
    iconComponent: { name: 'cil-description' },
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
    iconComponent: { name: 'cil-description' },
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
    iconComponent: { name: 'cil-description' },
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
    iconComponent: { name: 'cil-description' },
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
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục cáp điện',
        url: '/capdien/danhmuccapdien',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật cáp điện',
        url: '/capdien/tonghopcapdien',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Rơ le',
    url: '/role',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục rơ le',
        url: '/role/danhmucrole',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật rơ le',
        url: '/role/tonghoprole',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Biến áp',
    url: '/bienap',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục biến áp',
        url: '/bienap/danhmucbienap',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số biến áp',
        url: '/bienap/thongsobienap',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Ba lăng',
    url: '/balang',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục ba lăng',
        url: '/balang/danhmucbalang',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật ba lăng',
        url: '/balang/tonghopbalang',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Khoan',
    url: '/khoan',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục khoan',
        url: '/khoan/danhmuckhoan',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật khoan',
        url: '/khoan/tonghopkhoan',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Máy cào',
    url: '/maycao',
    iconComponent: { name: 'cil-description' },
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
        name: 'Cập nhật máy cào',
        url: '/maycao/tonghopmaycao',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Thiết bị neo',
    url: '/neo',
    iconComponent: { name: 'cil-description' },
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
      {
        name: 'Cập nhật neo',
        url: '/neo/tonghopneo',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Băng tải',
    url: '/bangtai',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục băng tải',
        url: '/bangtai/danhmucbangtai',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số kỹ thuật',
        url: '/bangtai/thongsobangtai',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật neo',
        url: '/neo/tonghopneo',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Áp to mát & khởi động từ',
    url: '/aptomatkhoidongtu',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục áp to mát & khởi động từ',
        url: '/aptomatkhoidongtu/danhmucaptomatkhoidongtu',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Thông số kỹ thuật',
        url: '/aptomatkhoidongtu/thongsoaptomatkhoidongtu',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật áp to mát & khởi động từ',
        url: '/aptomatkhoidongtu/tonghopaptomatkhoidongtu',
      },
    ],
  },
  {
    name: 'Giá & Cột thủy lực',
    url: '/giacotthuyluc',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục giá & Cột thủy lực',
        url: '/giacotthuyluc/danhmucgiacotthuyluc',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật giá & cột thủy lực',
        url: '/giacotthuyluc/tonghopgiacotthuyluc',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Camera',
    url: '/camera',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Danh mục camera',
        url: '/camera/danhmuccamera',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Nhật ký camera',
        url: '/camera/nhatkycamera',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cập nhật camera',
        url: '/camera/tonghopcamera',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Cập nhật máy tính',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/tonghopmaytinh',
  },
  {
    name: 'Cập nhật danh mục',
    title: true,
  },
  {
    name: 'Danh mục',
    url: '/danhmuc',
    iconComponent: { name: 'cil-description' },
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
    iconComponent: { name: 'cil-user' },
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
    iconComponent: { name: 'cil-settings' },
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
