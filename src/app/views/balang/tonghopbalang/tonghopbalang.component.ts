import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../core/services/data.service';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ModalBodyComponent,
  ModalHeaderComponent,
} from '@coreui/angular';

import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalComponent,
  ModalFooterComponent,
  ModalTitleDirective,
  ThemeDirective,
} from '@coreui/angular';

import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
export interface TongHopBaLang {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  donViTinh: string;
  soLuong: number;
  tinhTrangKyThuat: string;
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
  ghiChu: string;
}

@Component({
  selector: 'app-tonghopbalang',
  imports: [
    FormsModule,
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NzModalModule,
    SelectSearchComponent,
    NzButtonModule,
    NzIconModule,
    NzTableComponent,
    NzToolTipModule,
    ModalBodyComponent,
    ModalHeaderComponent,
    ButtonDirective,
    ModalComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalFooterComponent,
  ],

  templateUrl: './tonghopbalang.component.html',
  styleUrl: './tonghopbalang.component.scss',
})
export class TonghopbalangComponent implements OnInit {
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  sumSoluong!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  filterKeyword = '';
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  listOfBalang: TongHopBaLang[] = [];
  dataDetailOfBalang!: TongHopBaLangDetail;
  dsBalang: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  initFormBuilder() {
    this.Form = this.fb.group({
      id: [''],
      baLangId: [''],
      donViId: [''],
      viTriLapDat: [''],
      donViTinh: [''],
      soLuong: [''],
      ngayLap: [''],
      tinhTrangThietBi: [''],
      ghiChu: [''],
    });
  }

  public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  //Lấy danh sách phòng ban
  getDanhmucPhongban() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }
  //Lấy danh dách danh mục ba lăng
  getDanhmucBalang() {
    this.dataService.get('/api/Danhmucbalang').subscribe({
      next: (data: any) => {
        this.dsBalang = data;
      },
    });
  }
  // Lấy danh sách tổng hợp cáp điện
  getListTonghopbalang() {
    this.dataService
      .get(
        '/api/Tonghopbalang/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.listOfBalang = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }

  // Lấy chi tiết tổng hợp ba lang theo Id
  getTonghopbalangDetailById() {
    this.dataService.getById('/api/Tonghopbalang/' + this.Id).subscribe({
      next: (data: TongHopBaLangDetail) => {
        this.dataDetailOfBalang = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetailOfBalang.ngayLap = myDateString;
      },
    });
  }

  //Thêm mới
  addNewTonghopBalangDetail() {
    this.dataService.getById('/api/Tonghopbalang/' + 0).subscribe({
      next: (data) => {
        this.dataDetailOfBalang = data;
        var myDate = new Date(data.ngaylap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetailOfBalang.ngayLap = myDateString;
        this.loadFormData(this.dataDetailOfBalang);
      },
    });
  }

  // Gán dữ liệu cho form khi truyền dữ liệu vào
  private loadFormData(data: TongHopBaLangDetail) {
    this.dataDetailOfBalang = data;
    this.Form.setValue({
      id: data.id,
      donViId: data.donViId,
      baLangId: data.baLangId,
      ngayLap: data.ngayLap,
      donvitinh: data.donViTinh,
      viTriLapDat: data.viTriLapDat,
      tinhTrangKyThuat: data.tinhTrangKyThuat,
      ghichu: data.ghiChu,
    });
  }
  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.getListTonghopbalang();
  }

  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.getListTonghopbalang();
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.getListTonghopbalang();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.getListTonghopbalang();
  }
  onThemmoi() {
    this.title = 'Thêm ba lăng';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopBalangDetail();
    this.visible = true;
  }
  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getTonghopbalangDetailById();
    this.title = 'Sửa tời điện';
    this.visible = !this.visible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenThietBi,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.onDelete(item),
    });
  }
  onDelete(item: any) {
    this.Id = item.id;
    this.dataService.delete('/api/Tonghopbalang/' + this.Id).subscribe({
      next: () => {
        this.getListTonghopbalang();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listOfBalang);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopbalang.xlsx');
  }
  ngOnInit(): void {
    this.getListTonghopbalang();
    this.getDanhmucBalang();
    this.getDanhmucPhongban();
    this.initFormBuilder();
  }
}
