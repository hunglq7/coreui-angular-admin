export interface TongHopCapDienDetail {
  id: number;
  maquanly: string;
  donviId: number;
  ngaythang: string;
  capdienId: number;
  donvitinh: string;
  tondauthang: number;
  nhaptrongky: number;
  xuattrongky: number;
  toncuoithang: number;
  dangsudung: number;
  duphong: number;
  ghichu: string;
}

export interface TongHopCapDienList {
  id: number;
  maquanly?: string;
  tenDonVi?: string;
  ngaythang: Date;
  tenThietBi?: string;
  donvitinh?: string;
  tondauthang: number;
  nhaptrongky: number;
  xuattrongky: number;
  toncuoithang: number;
  dangsudung: number;
  duphong: number;
}
