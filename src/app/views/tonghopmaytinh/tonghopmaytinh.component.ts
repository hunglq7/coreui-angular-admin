import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SearchNhanvienDonviComponent } from '../../components/nav-search-nhanvien-donvi/search-nhanvien-donvi.component';
import * as XLSX from 'xlsx';
export interface TongHopThietBi {
  id: number;
  maThietBi: string;
  trangThai: boolean;
  hinhAnh: string;
  tenThietBi: string;
  tenDonViTinh: string;
  soLuong: number;
  tenLoai: string;
  ngaySuDung: Date;
  tinhTrangThietBi: string;
  tenPhong: string;
  tenNhanvien: string;
}

export interface NhanVien {
  id: number;
  soThe: string;
  tenNhanVien: string;
  dienThoai: string;
  ngaySinh: string;
  diaChi: string;
  hinhAnh: string;
  tenPhong: string;
  tenChucVu: string;
  giChu: any;
  trangThai: boolean;
}

export interface PhongBan {
  id: number;
  tenPhong: string;
  trangThai: boolean;
}

@Component({
  selector: 'app-tonghopmaytinh',
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    NzTableModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    SearchNhanvienDonviComponent,
  ],
  templateUrl: './tonghopmaytinh.component.html',
  styleUrl: './tonghopmaytinh.component.scss',
})
export class TonghopmaytinhComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  sumSoluong!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  keywordNhanvien: number = 0;
  keywordDonvi: number = 0;
  dataMaytinh: TongHopThietBi[] = [];
  dsNhanVien: NhanVien[] = [];
  dsPhongban: PhongBan[] = [];
  loading = true;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}
  loadTonghopMaytinh() {
    this.loading = true;
    this.dataService
      .get(
        '/api/Tonghopthietbi/paging?nhanVienId=' +
          this.keywordNhanvien +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataMaytinh = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
        this.loading = false;
      });
  }
  public pageIndexChanged(event: any): void {
    console.log(event);
    this.pageIndex = event;
    this.loadTonghopMaytinh();
  }

  public pageSizeChange(event: any): void {
    this.pageSize = event;
    this.loadTonghopMaytinh();
  }
  onEdit(item: Number) {}
  onDelete(item: Number) {}

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsPhongban = data;
      },
    });
  }
  getDataNhanvien() {
    this.dataService.get('/api/Nhanvien').subscribe({
      next: (data: any) => {
        this.dsNhanVien = data;
      },
    });
  }
  eventNhanvien($event: number) {
    this.keywordNhanvien = $event;
    this.loadTonghopMaytinh();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopMaytinh();
  }
  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataMaytinh);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghonpmaytinh.xlsx');
  }
  onThemmoi() {}
  ngOnInit(): void {
    this.loadTonghopMaytinh();
    this.getDataDonvi();
    this.getDataNhanvien();
  }
}
