import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
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
  TabDirective,
  DropdownModule,
  SharedModule,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  FormControlDirective,
} from '@coreui/angular';
import {
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
} from '@coreui/angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import { ThongsomaycaoTabComponent } from '../thongsomaycao-tab/thongsomaycao-tab.component';
import { NhatkymaycaoTabComponent } from '../nhatkymaycao-tab/nhatkymaycao-tab.component';
import { NzFormModule } from 'ng-zorro-antd/form';
export interface TonghopmaycaoDetail {
  id: number;
  maQuanLy: string;
  mayCaoId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  chieuDaiMay: number;
  soLuongXich: number;
  soLuongCauMang: number;
  tinhTrangThietBi: string;
  duPhong:boolean;
  ghiChu: string;
}

export interface TongHopMayCao {
  id: number;
  maQuanLy: string;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  chieuDaiMay: number;
  soLuongXich: number;
  soLuongCauMang: number;
  tinhTrangThietBi: string;
  duPhong:Boolean;
  ghiChu: string;
}
@Component({
  selector: 'app-tonghopmaycao',
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
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    FormsModule,
    SelectSearchComponent,
    ThongsomaycaoTabComponent,
    NhatkymaycaoTabComponent,
    NzModalModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    NzToolTipModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    NzFormModule,
  ],
  
  templateUrl: './tonghopmaycao.component.html',
  styleUrl: './tonghopmaycao.component.scss',
})
export class TonghopmaycaoComponent implements OnInit {
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
  dataMaycao: TongHopMayCao[] = [];
  dataMaycaoDetail: TonghopmaycaoDetail = {
    id: 0,
    maQuanLy: '',
    mayCaoId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 0,
    chieuDaiMay: 0,
    soLuongXich: 0,
    soLuongCauMang: 0,
    tinhTrangThietBi: '',
    duPhong:false,
    ghiChu: '',
  };
  dsMaycao: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  size: NzButtonSize = 'small';
  public themoi: boolean = false;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {}
  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl(null, Validators.required),
      maQuanLy: new FormControl(''),
      mayCaoId: new FormControl(null, Validators.required),
      donViId: new FormControl(null, Validators.required),
      viTriLapDat: new FormControl(''),
      ngayLap: new FormControl(''),
      soLuong: new FormControl(''),
      chieuDaiMay: new FormControl(''),
      soLuongXich: new FormControl(''),
      soLuongCauMang: new FormControl(''),
      tinhTrangThietBi: new FormControl(''),
      duPhong:new FormControl(''),
      ghiChu: new FormControl(''),
    });
  }
  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadTonghopMaycao();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopMaycao();
  }
  loadTonghopMaycaoDetail() {
    this.dataService.getById('/api/Tonghopmaycao/' + this.Id).subscribe({
      next: (data: TonghopmaycaoDetail) => {
        this.dataMaycaoDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataMaycaoDetail.ngayLap = myDateString;
      },
    });
  }
  addNewTonghopMaycaoDetail() {
    this.dataService.getById('/api/Tonghopmaycao/' + 0).subscribe({
      next: (data) => {
        this.dataMaycaoDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataMaycaoDetail.ngayLap = myDateString;
        this.loadFormData(this.dataMaycaoDetail);
      },
    });
  }
  private loadFormData(items: TonghopmaycaoDetail) {
    this.dataMaycaoDetail = items;
    this.Form.setValue({
      id: items.id,
      maQuanLy: items.maQuanLy,
      mayCaoId: items.mayCaoId,
      donViId: items.donViId,
      viTriLapDat: items.viTriLapDat,
      chieuDaiMay: items.chieuDaiMay,
      ngayLap: items.ngayLap,
      soLuong: items.soLuong,
      soLuongXich: items.soLuongXich,
      soLuongCauMang: items.soLuongCauMang,
      tinhTrangThietBi: items.tinhTrangThietBi,
      duPhong:items.duPhong,
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

  getDataMaycao() {
    this.dataService.get('/api/Danhmucmaycao').subscribe({
      next: (data: any) => {
        this.dsMaycao = data;
      },
    });
  }

  loadTonghopMaycao() {
    this.dataService
      .get(
        '/api/Tonghopmaycao/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataMaycao = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopMaycao();
  }
  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.loadTonghopMaycao();
  }
  onThemmoi() {
    this.title = 'Thêm máy cào';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopMaycaoDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopMaycaoDetail();
    this.title = 'Sửa máy cào';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onDelete(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bán có muốn xóa bản ghi này?</i>',
      nzContent: '<b>Thiết bị: </b>' + item.tenThietBi,
      nzStyle: {
        position: 'relative',
        top: `${pos * 90}px`,
        left: `${pos * 60}px`,
      },
      nzOnOk: () => this.Delete(item),
    });
  }
  Delete(item: any) {
    this.Id = item.id;
    this.dataService.delete('/api/Tonghopmaycao/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopMaycao();
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
      this.dataService.post('/api/Tonghopmaycao', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopMaycao();
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
        .put('/api/Tonghopmaycao/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopMaycao();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataMaycao);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopmaycao.xlsx');
  }

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopMaycao();
    this.getDataDonvi();
    this.getDataMaycao();
    if ((this.Id = 0)) {
      this.addNewTonghopMaycaoDetail();
    } else {
      this.loadTonghopMaycaoDetail();
    }
  }
}
