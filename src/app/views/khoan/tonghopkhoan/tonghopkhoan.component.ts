import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ButtonCloseDirective,
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
  DropdownModule,
  SharedModule,
  FormModule,
} from '@coreui/angular';

// Tab
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

export interface Tonghopkhoan {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  donViTinh: string;
  soLuong: number;
  ngayLap: Date;
  viTriLapDat: string;
  tinhTrangKyThuat: string;
  ghiChu: string;
}

export interface TonghopkhoanDetail {
  id: number;
  khoanId: number;
  donViId: number;
  donViTinh: string;
  soLuong: number;
  ngayLap: string;
  viTriLapDat: string;
  tinhTrangKyThuat: string;
  ghiChu: string;
}
@Component({
  selector: 'app-tonghopkhoan',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    SharedModule,
    FormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    SelectSearchComponent,
    NzFloatButtonModule,
    NzModalModule,
    NzToolTipModule,
  ],
  templateUrl: './tonghopkhoan.component.html',
  styleUrl: './tonghopkhoan.component.scss',
})
export class TonghopkhoanComponent implements OnInit {
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
  filterKeyword = '';
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  khoans: Tonghopkhoan[] = [];
  khoanDetail!: TonghopkhoanDetail;
  dsKhoan: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;
  size: NzButtonSize = 'small';
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}
  initFormBuilder(): void {
    this.Form = new FormGroup({
      id: new FormControl(0, Validators.required),
      khoanId: new FormControl(null, Validators.required),
      donViId: new FormControl(null, Validators.required),
      donViTinh: new FormControl('', Validators.required),
      soLuong: new FormControl(0, [Validators.required, Validators.min(1)]),
      ngayLap: new FormControl(null, Validators.required),
      viTriLapDat: new FormControl(''),
      tinhTrangKyThuat: new FormControl(''),
      ghiChu: new FormControl(''),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadTonghopkhoan();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopkhoan();
  }
  loadTonghopkhoanDetail() {
    this.dataService.getById('/api/Tonghopkhoan/' + this.Id).subscribe({
      next: (data: TonghopkhoanDetail) => {
        this.khoanDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.khoanDetail.ngayLap = myDateString;
      },
    });
  }

  themoiTonghopkhoanDetail() {
    this.dataService.getById('/api/Tonghopkhoan/' + 0).subscribe({
      next: (data) => {
        this.khoanDetail = data;
        var myDate = new Date(this.khoanDetail.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.khoanDetail.ngayLap = myDateString;
        this.loadFormData(this.khoanDetail);
      },
    });
  }

  loadFormData(data: TonghopkhoanDetail): void {
    this.Form.patchValue({
      id: data.id,
      khoanId: data.khoanId,
      donViId: data.donViId,
      donViTinh: data.donViTinh,
      soLuong: data.soLuong,
      ngayLap: data.ngayLap,
      viTriLapDat: data.viTriLapDat,
      tinhTrangKyThuat: data.tinhTrangKyThuat,
      ghiChu: data.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }

  getDataKhoan() {
    this.dataService.get('/api/Danhmuckhoan').subscribe({
      next: (data: any) => {
        this.dsKhoan = data;
      },
    });
  }

  loadTonghopkhoan() {
    this.dataService
      .get(
        '/api/Tonghopkhoan/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.khoans = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopkhoan();
  }

  onThemmoi() {
    this.title = 'Thêm khoan';
    this.themoi = true;
    this.Id = 0;
    this.themoiTonghopkhoanDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopkhoanDetail();
    this.title = 'Sửa khoan';
    this.liveDemoVisible = !this.liveDemoVisible;
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
    this.dataService.delete('/api/Tonghopkhoan/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopkhoan();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }
  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  save() {
    if (this.themoi) {
      this.dataService.post('/api/Tonghopkhoan', this.Form.value).subscribe({
        next: () => {
          console.log(this.Form.value);
          this.loadTonghopkhoan();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService.put('/api/Tonghopkhoan', this.Form.value).subscribe({
        next: () => {
          console.log(this.Form.value);
          this.loadTonghopkhoan();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    }
  }

  onReset() {
    this.Form.reset();
  }

  readonly activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.khoans);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopkhoan.xlsx');
  }
  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.loadTonghopkhoan();
  }

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopkhoan();
    this.getDataDonvi();
    this.getDataKhoan();
    if ((this.Id = 0)) {
      this.themoiTonghopkhoanDetail();
    } else {
      this.loadTonghopkhoanDetail();
    }
  }
}
