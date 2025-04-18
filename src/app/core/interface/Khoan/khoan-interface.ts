export interface Tonghopkhoan {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  donViTinh: string;
  soLuong: number;
  ngayLap: Date;
  viTriLapDat: string;
  tinhTrangKyThuat: string;
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
  ghiChu: string;
}
