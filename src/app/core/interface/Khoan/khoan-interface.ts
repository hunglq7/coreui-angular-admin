export interface Tonghopkhoan {
  id: number;
  maQuanLy: string;
  tenThietBi: string;
  tenDonVi: string;
  donViTinh: string;
  soLuong: number;
  ngayLap: string;
  viTriLapDat: string;
  tinhTrangKyThuat: string;
  duPhong:boolean;
  ghiChu: string;
}

export interface TonghopkhoanDetail {
  id: number;
  khoanId: number;
  donViId: number;
  donViTinh: string;
  soLuong: number;
  ngayLap: string;
  viTriLapDat: string;
  tinhTrangKyThuat: string;
  duPhong:boolean;
  ghiChu: string;
}
