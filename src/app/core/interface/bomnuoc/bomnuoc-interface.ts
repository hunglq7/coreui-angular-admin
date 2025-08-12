export interface ThongSoBomNuoc {
  id: number;
  tenThietBi: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface ThongSoBomNuocDetail {
  id: number;
  bomNuocId: number;
  noiDung: string;
  donViTinh: string;
  thongSo: string;
}
export interface TongHopBomNuoc {
  id: number;
  maQuanLy: string;
  tenThietBi: number;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
}

export interface TongHopBomNuocDetail {
  id: number;
  maQuanLy: string;
  bomNuocId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong: boolean;
  ghiChu: string;
}

export interface NhatKyBomNuocDetail {
  id: number;
  tonghopbomnuocId: number;
  ngayLap: string;
  donVi: string;
  viTri: string;
  trangThai: string;
  ghiChu: string;
}
