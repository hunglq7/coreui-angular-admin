export interface TongHopBaLang {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  donViTinh: string;
  soLuong: number;
  tinhTrangKyThuat: string;
  duPhong:boolean;
  ghiChu: string;
}

export interface TongHopBaLangDetail {
  id: number;
  baLangId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  donViTinh: string;
  soLuong: number;
  tinhTrangKyThuat: string;
  duPhong:boolean;
  ghiChu: string;
}
