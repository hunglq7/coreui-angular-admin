import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
  GutterDirective,
} from '@coreui/angular';

import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

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

@Component({
  selector: 'app-tonghopcapdien',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormSelectDirective,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    PaginationModule,
    DropdownModule,
    TableDirective,
    SharedModule,
    GutterDirective,
    FormsModule,
  ],
  templateUrl: './tonghopcapdien.component.html',
  styleUrl: './tonghopcapdien.component.scss',
})
export class TonghopcapdienComponent implements OnInit {
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
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  dataView: TongHopCapDienList[] = [];
  dataDetail!: TongHopCapDienDetail;
  dsCapdien: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  public themoi: boolean = false;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDanhsachTonghopcapdien();
    this.getDanhmucPhongban();
    this.getDanhmucCapdien();
    this.initFormBuilder();
    if ((this.Id = 0)) {
      this.addNewTonghopcapdienDetail();
    } else {
      this.getTonghopcapdienDetailById();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: '',
      maquanly: '',
      donviId: ['', Validators.required],
      ngaythang: new Date(),
      capdienId: ['', Validators.required],
      donvitinh: [''],
      tondauthang: [''],
      nhaptrongky: [''],
      xuattrongky: [''],
      toncuoithang: [''],
      dangsudung: [''],
      duphong: [''],
      ghichu: [''],
    });
  }
  // Lấy danh sách phòng ban
  getDanhmucPhongban() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }
  //Lấy danh sách cáp điện
  getDanhmucCapdien() {
    this.dataService.get('/api/Capdien').subscribe({
      next: (data: any) => {
        this.dsCapdien = data;
      },
    });
  }

  // Lấy danh sách tổng hợp cáp điện
  getDanhsachTonghopcapdien() {
    this.dataService
      .get(
        '/api/Tonghopcapdien/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        console.log(data);
        this.dataView = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  // Lấy chi tiết tổng hợp cáp điện theo Id
  getTonghopcapdienDetailById() {
    this.dataService.getById('/api/Tonghopcapdien/' + this.Id).subscribe({
      next: (data: TongHopCapDienDetail) => {
        this.dataDetail = data;
        var myDate = new Date(data.ngaythang);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetail.ngaythang = myDateString;
      },
    });
  }

  //Thêm mới
  addNewTonghopcapdienDetail() {
    this.dataService.getById('/api/Tonghopcapdien/' + 0).subscribe({
      next: (data) => {
        console.log(data);
        this.dataDetail = data;
        var myDate = new Date(data.ngaythang);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetail.ngaythang = myDateString;
        this.loadFormData(this.dataDetail);
      },
    });
  }

  // Gán dữ liệu cho form khi truyền dữ liệu vào
  private loadFormData(data: TongHopCapDienDetail) {
    this.dataDetail = data;
    this.Form.setValue({
      id: data.id,
      maquanly: data.maquanly,
      donviId: data.donviId,
      ngaythang: data.ngaythang,
      capdienId: data.capdienId,
      donvitinh: data.donvitinh,
      tondauthang: data.tondauthang,
      nhaptrongky: data.nhaptrongky,
      xuattrongky: data.xuattrongky,
      toncuoithang: data.toncuoithang,
      dangsudung: data.dangsudung,
      duphong: data.duphong,
      ghichu: data.ghichu,
    });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.getDanhsachTonghopcapdien();
  }

  onThemmoi() {
    this.title = 'Thêm cáp điện';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopcapdienDetail();
    this.visible = !this.visible;
  }

  onClode() {
    this.Form.reset();
    this.visible = !this.visible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.getTonghopcapdienDetailById();
    this.title = 'Sửa cáp điện';
    this.visible = !this.visible;
  }

  onDelete(id: number) {
    this.Id = id;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Bán có muốn xóa bản ghi này?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.delete('/api/Tonghopcapdien/' + this.Id).subscribe({
          next: () => {
            this.getDanhsachTonghopcapdien();
            this.toastr.success('Xóa dữ liệu thành công', 'Success');
          },
          error: () => {
            this.toastr.error('Xóa dữ liệu thất bại', 'Error');
          },
        });
      }
    });
  }

  save() {
    if (this.themoi) {
      debugger;
      this.dataService.post('/api/Tonghopcapdien', this.Form.value).subscribe({
        next: () => {
          this.getDanhsachTonghopcapdien();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.visible = !this.visible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService
        .put('/api/Tonghopcapdien/update', this.Form.value)
        .subscribe({
          next: () => {
            this.getDanhsachTonghopcapdien();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.visible = !this.visible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    }
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataView);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopcapdien.xlsx');
  }

  public visible = false;

  toggle() {
    this.visible = !this.visible;
  }

  handleChange(event: any) {
    this.visible = event;
  }
}
