import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NhatkytoidienTabComponent } from '../nhatkytoidien-tab/nhatkytoidien-tab.component';
import { ThongsotoidienTabComponent } from '../thongsotoidien-tab/thongsotoidien-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  Validators,
  FormControl,
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
  TabDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  InputGroupComponent,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';

// Tab
import {
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';

import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
export interface Tonghoptoitruc {
  id: number;
  maQuanLy: string;
  tenThietBi: string;
  phongBan: string;
  viTriLapDat: string;
  ngayLap: string;
  mucDichSuDung: string;
  soLuong: number;
  tinhTrangThietBi: string;
}

export interface TonghoptoitrucDetail {
  id: number;
  maQuanLy: string;
  thietbiId: number;
  donViSuDungId: number;
  viTriLapDat: string;
  ngayLap: string;
  mucDichSuDung: string;
  soLuong: number;
  tinhTrangThietBi: string;
  ghiChu: string;
}

@Component({
  selector: 'app-capnhattoidien',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
    InputGroupComponent,
    FormSelectDirective,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    NgTemplateOutlet,
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
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    NhatkytoidienTabComponent,
    ThongsotoidienTabComponent,
  ],

  templateUrl: './capnhattoidien.component.html',
  styleUrl: './capnhattoidien.component.scss',
})
export class CapnhattoidienComponent implements OnInit {
  public liveDemoVisible = false;
  title: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;
  totalRow!: number;
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  filterKeyword = '';
  keywordThietbi: number = 0;
  keywordDonvi: number = 0;
  toitrucs: Tonghoptoitruc[] = [];
  toitrucDetail!: TonghoptoitrucDetail;
  dsToitruc: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;

  constructor(private dataService: DataService, private toastr: ToastrService) {
    this.initFormBuilder();
  }
  ngOnInit(): void {
    this.loadTonghoptoitruc();
    this.getDataDonvi();
    this.getDataToitruc();
    if ((this.Id = 0)) {
      this.themoiTonghoptoitrucDetail();
    } else {
      this.loadTonghoptoitrucDetail();
    }
  }

  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true,
  };

  initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl(),
      maQuanLy: new FormControl('', [Validators.required]),
      thietbiId: new FormControl('', [Validators.required]),
      donViSuDungId: new FormControl('', [Validators.required]),
      viTriLapDat: new FormControl('', [Validators.required]),
      ngayLap: new FormControl('', [Validators.required]),
      mucDichSuDung: new FormControl(''),
      soLuong: new FormControl('', [Validators.required]),
      tinhTrangThietBi: new FormControl(''),
      ghiChu: new FormControl(''),
    });
  }

  loadTonghoptoitrucDetail() {
    this.dataService.getById('/api/Tonghoptoitruc/' + this.Id).subscribe({
      next: (data: TonghoptoitrucDetail) => {
        this.toitrucDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.toitrucDetail.ngayLap = myDateString;
      },
    });
  }

  themoiTonghoptoitrucDetail() {
    this.dataService.getById('/api/Tonghoptoitruc/' + 0).subscribe({
      next: (data) => {
        this.toitrucDetail = data;
        var myDate = new Date(this.toitrucDetail.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.toitrucDetail.ngayLap = myDateString;
        this.loadFormData(this.toitrucDetail);
      },
    });
  }
  loadFormData(items: TonghoptoitrucDetail) {
    this.toitrucDetail = items;
    this.Form.patchValue({
      id: items.id,
      maQuanly: items.maQuanLy,
      thietbiId: items.thietbiId,
      donViSuDung: items.donViSuDungId,
      viTriLapDat: items.viTriLapDat,
      ngayLap: items.ngayLap,
      mucDichSuDung: items.mucDichSuDung,
      soLuong: items.soLuong,
      tinhTrangThietBi: items.tinhTrangThietBi,
      ghiChu: items.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }

  getDataToitruc() {
    this.dataService.get('/api/Danhmuctoitruc').subscribe({
      next: (data: any) => {
        this.dsToitruc = data;
      },
    });
  }

  loadTonghoptoitruc() {
    this.dataService
      .get(
        '/api/Tonghoptoitruc/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.toitrucs = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
      });
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghoptoitruc();
  }
  onThemmoi() {
    this.title = 'Thêm tời điện';
    this.themoi = true;
    this.Id = 0;
    this.themoiTonghoptoitrucDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghoptoitrucDetail();
    this.title = 'Sửa tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onDelete(id: number) {
    this.Id = id;
    this.dataService.delete('/api/Tonghoptoitruc/' + this.Id).subscribe({
      next: () => {
        this.loadTonghoptoitruc();
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
      this.dataService.post('/api/Tonghoptoitruc', this.Form.value).subscribe({
        next: () => {
          this.loadTonghoptoitruc();
          this.toastr.success('Lưu dữ liệu thành công', 'Success');
          this.liveDemoVisible = !this.liveDemoVisible;
          this.Form.reset();
        },
        error: () => {
          this.toastr.error('Lưu dữ liệu thất bại', 'Error');
        },
      });
    } else {
      this.dataService.put('/api/Tonghoptoitruc', this.Form.value).subscribe({
        next: () => {
          this.loadTonghoptoitruc();
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

  public panes = [
    { name: 'Home 01', id: 'tab-01', icon: 'cilHome' },
    { name: 'Profile 02', id: 'tab-02', icon: 'cilUser' },
    { name: 'Contact 03', id: 'tab-03', icon: 'cilCode' },
  ];

  readonly activeItem = signal(0);

  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }

  exportexcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.toitrucs);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghoptoidien.xlsx');
  }
}
