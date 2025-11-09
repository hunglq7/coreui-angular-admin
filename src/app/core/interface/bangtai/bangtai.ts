export interface TongHopBangTaiDetail {
  id: number;
  maHieu: string;
  bangTaiId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  nMay: string;
  lMay: string;
  khungDau: string;
  khungDuoi: string;
  khungBangRoi: string;
  dayBang: string;
  conLan: string;
  tinhTrangThietbi: string;
  duPhong:boolean;
  ghiChu: string;
}

export interface TongHopBangTai {
  id: number;
  maHieu: string;
  tenThietBi: string;
  tenPhong: string;
  viTriLapDat: string;
  ngayLap: string;
  duPhong:boolean;
} 