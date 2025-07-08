export interface TonghoproleList {
  id: number;
  tenThietBi: string;
  tenPhong: string;
  tenViTriLapDat: string;
  ngayLap: Date;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong: boolean;
  lamViec: boolean;
  ghiChu: string;
}

export interface TonghoproleDetail {
  id: number;
  roleId: number;
  phongBanId: number;
  viTriLapDat: string;
  ngayLap: Date;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong: boolean;
  lamViec: boolean;
  ghiChu: string;
}
