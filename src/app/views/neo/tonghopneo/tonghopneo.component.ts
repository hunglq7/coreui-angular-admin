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
import { ThongsoneoTabComponent } from '../thongsoneo-tab/thongsoneo-tab.component';
import { NhatkyneoTabComponent } from '../nhatkyneo-tab/nhatkyneo-tab.component';

export interface TonghopneoDetail {
  id: number;
  neoId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  ghiChu: string;
}

export interface TongHopNeo {
  id: number;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  ghiChu: string;
}

@Component({
  selector: 'app-tonghopneo',
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
    ThongsoneoTabComponent,
    NhatkyneoTabComponent,
    NzModalModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    NzToolTipModule,
  ],
  templateUrl: './tonghopneo.component.html',
  styleUrl: './tonghopneo.component.scss',
})
export class TonghopneoComponent implements OnInit {
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
  dataNeo: TongHopNeo[] = [];
  dataNeoDetail!: TonghopneoDetail;
  dsNeo: any[] = [];
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
      neoId: new FormControl(null, Validators.required),
      donViId: new FormControl(null, Validators.required),
      viTriLapDat: new FormControl(''),
      ngayLap: new FormControl(''),
      soLuong: new FormControl(''),
      tinhTrangThietBi: new FormControl(''),
      ghiChu: new FormControl(''),
    });
  }

  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadTonghopNeo();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopNeo();
  }

  loadTonghopNeoDetail() {
    this.dataService.getById('/api/Tonghopneo/' + this.Id).subscribe({
      next: (data: TonghopneoDetail) => {
        this.dataNeoDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataNeoDetail.ngayLap = myDateString;
      },
    });
  }

  addNewTonghopNeoDetail() {
    this.dataService.getById('/api/Tonghopneo/' + 0).subscribe({
      next: (data) => {
        this.dataNeoDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataNeoDetail.ngayLap = myDateString;
        this.loadFormData(this.dataNeoDetail);
      },
    });
  }

  private loadFormData(items: TonghopneoDetail) {
    this.dataNeoDetail = items;
    this.Form.setValue({
      id: items.id,
      neoId: items.neoId,
      donViId: items.donViId,
      viTriLapDat: items.viTriLapDat,
      ngayLap: items.ngayLap,
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

  getDataNeo() {
    this.dataService.get('/api/Danhmucneo').subscribe({
      next: (data: any) => {
        this.dsNeo = data;
      },
    });
  }

  loadTonghopNeo() {
    this.dataService
      .get(
        '/api/Tonghopneo/paging?thietbiId=' +
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
        this.dataNeo = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }

  public pageIndexChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghopNeo();
  }

  public pageSizeChange(event: any): void {
    this.pageSize = event.pageSize;
    this.loadTonghopNeo();
  }

  onThemmoi() {
    this.title = 'Thêm neo';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopNeoDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopNeoDetail();
    this.title = 'Sửa neo';
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
    this.dataService.delete('/api/Tonghopneo/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopNeo();
        this.toastr.success('Xóa dữ liệu thành công', 'Success');
      },
      error: () => {
        this.toastr.error('Xóa dữ liệu thất bại', 'Error');
      },
    });
  }
  save() {
    if (this.themoi) {
      this.dataService.post('/api/Tonghopneo', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopNeo();
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
        .put('/api/Tonghopneo/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopNeo();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataNeo);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghoneo.xlsx');
  }
  onReset() {
    this.Form.reset();
  }

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopNeo();
    this.getDataDonvi();
    this.getDataNeo();
    if ((this.Id = 0)) {
      this.addNewTonghopNeoDetail();
    } else {
      this.loadTonghopNeoDetail();
    }
  }
}
