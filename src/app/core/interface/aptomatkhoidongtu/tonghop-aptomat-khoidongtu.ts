export interface TongHopAptomatKhoidongtu {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayKiemDinh: string;
  ngayLap: string;
  tinhTrang: string;
  duPhong:boolean,
  ghiChu: string;
}

export interface TongHopAptomatKhoidongtuDetail {
  id: number;
  thietBiId: number;
  donViId: number;
  viTriLapDat: string;
  ngayKiemDinh: string;
  ngayLap: string;
  tinhTrang: string;
  duPhong:boolean,
  ghiChu: string;
}
