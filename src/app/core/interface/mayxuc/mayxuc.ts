export interface Thongsokythuatmayxuc {
  id: number;
  tenThietBi: string;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface ThongsokythuatmayxucEdit {
  id: number;
  mayXucId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface TongHopMayXuc {
  id: number;
  maQuanLy: string;
  tenMayXuc: string;
  loaiThietBi: string;
  tenPhongBan: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrang: string;
  ghiChu: string;
}

export interface TonghopMayxucDetail {
  id: number;
  mayXucId: number;
  maQuanLy: string;
  loaiThietBiId: number;
  phongBanId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrang: string;
  ghiChu: string;
}
