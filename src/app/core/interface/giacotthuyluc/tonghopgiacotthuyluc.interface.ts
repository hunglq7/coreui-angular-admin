export interface Tonghopgiacotthuyluc {
  id: number;
  tenThietBi: string;
  donVi: string;
  viTriLapDat: string;
  ngayLap: string; // ISO date string
  soLuong: number;
  duPhong:boolean;
  ghiChu?: string;
}

export interface Tonghopgiacotthuylucdetail {
  id: number;
  thietBiId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string; // ISO date string
  soLuong: number;
  duPhong:boolean;
  ghiChu?: string;
}
