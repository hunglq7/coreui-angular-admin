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

  templateUrl: './tonghopbalang.component.html',
  styleUrl: './tonghopbalang.component.scss',
})
export class TonghopbalangComponent implements OnInit {
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
  BaLangs: TongHopBaLang[] = [];
  baLangDetail: TongHopBaLangDetail = {
    id: 0,
    baLangId: 0,
    donViId: 0,
    donViTinh: '',
    soLuong: 1,
    ngayLap: '',
    viTriLapDat: '',
    tinhTrangKyThuat: '',
    ghiChu: '',
  };
  dsBaLang: any[] = [];
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
      id: new FormControl(0),
      baLangId: new FormControl(null, Validators.required),
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
    this.loadTonghopbalang();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopbalang();
  }
  loadTonghopbalangDetail() {
    this.dataService.getById('/api/Tonghopbalang/' + this.Id).subscribe({
      next: (data: TongHopBaLangDetail) => {
        this.baLangDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.baLangDetail.ngayLap = myDateString;
      },
    });
  }

  themoiTonghopbalangDetail() {
    this.dataService.getById('/api/Tonghopbalang/' + 0).subscribe({
      next: (data) => {
        this.baLangDetail = data;
        var myDate = new Date(this.baLangDetail.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.baLangDetail.ngayLap = myDateString;
        this.loadFormData(this.baLangDetail);
      },
    });
  }

  loadFormData(data: TongHopBaLangDetail): void {
    this.Form.patchValue({
      id: data.id,
      baLangId: data.baLangId,
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

  getDataBalang() {
    this.dataService.get('/api/Danhmucbalang').subscribe({
      next: (data: any) => {
        this.dsBaLang = data;
      },
    });
  }

  loadTonghopbalang() {
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
        this.BaLangs = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopbalang();
  }

  onThemmoi() {
    this.title = 'Thêm mới ba lăng';
    this.themoi = true;
    this.Id = 0;
    this.themoiTonghopbalangDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopbalangDetail();
    this.title = 'Sửa bảng ba lăng';
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
    this.dataService.delete('/api/Tonghopbalang/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopbalang();
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
      this.dataService.post('/api/Tonghopbalang', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopbalang();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService
        .put('/api/Tonghopbalang/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopbalang();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.BaLangs);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopbalang.xlsx');
  }
  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.loadTonghopbalang();
  }

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopbalang();
    this.getDataDonvi();
    this.getDataBalang();
    if ((this.Id = 0)) {
      this.themoiTonghopbalangDetail();
    } else {
      this.loadTonghopbalangDetail();
    }
  }
}
