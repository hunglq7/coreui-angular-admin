import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhatkymayxucTabComponent } from '../nhatkymayxuc-tab/nhatkymayxuc-tab.component';
import { ThongsomayxucTabComponent } from '../thongsomayxuc-tab/thongsomayxuc-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
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
  TabDirective,
  FormControlDirective,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import {
  TongHopMayXuc,
  TonghopMayxucDetail,
} from '../../../core/interface/mayxuc/mayxuc';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
@Component({
  selector: 'app-tonghopmayxuc',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormControlDirective,
    FormSelectDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    RowComponent,
    ColComponent,
    PaginationModule,
    DropdownModule,
    SharedModule,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    NhatkymayxucTabComponent,
    ThongsomayxucTabComponent,
    SelectSearchComponent,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzCascaderModule,
    NzTableModule,
    NzFloatButtonModule,
    NzModalModule,
    NzToolTipModule,
    NzFormModule,
  ],
  templateUrl: './tonghopmayxuc.component.html',
  styleUrl: './tonghopmayxuc.component.scss',
})
export class TonghopmayxucComponent implements OnInit {
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
  dataMayxucDetail: TongHopMayXuc[] = [];
  tonghopmayxucDetail: TonghopMayxucDetail = {
    id: 0,
    mayXucId: 0,
    maQuanLy: '',
    loaiThietBiId: 0,
    phongBanId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 0,
    tinhTrang: '',
    ghiChu: '',
  };
  dsMayxuc: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
  Form!: FormGroup;
  Id: Number = 0;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';
  ngOnInit(): void {
    this.loadTonghopMayxuc();
    this.getDataDonvi();
    this.getLoaiThietBi();
    this.getDataMayxuc();
    if ((this.Id = 0)) {
      this.addNewTonghopMayxucDetail();
    } else {
      this.loadTonghopMayxucDetail();
    }
  }

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private modal: NzModalService
  ) {
    this.initFormBuilder();
  }
  private initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl({ value: null, disabled: false }),
      maQuanLy: new FormControl({ value: null, disabled: false }),
      mayXucId: new FormControl({ value: null, disabled: false }),
      phongBanId: new FormControl({ value: null, disabled: false }),
      loaiThietBiId: new FormControl({ value: null, disabled: false }),
      viTriLapDat: new FormControl({ value: null, disabled: false }),
      ngayLap: new FormControl({ value: null, disabled: false }),
      soLuong: new FormControl({ value: null, disabled: false }),
      tinhTrang: new FormControl({ value: null, disabled: false }),
      ghiChu: new FormControl({ value: null, disabled: false }),
    });
  }
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true,
  };

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadTonghopMayxuc();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadTonghopMayxuc();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadTonghopMayxuc();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadTonghopMayxuc();
  }
  getLoaiThietBi() {
    this.dataService.get('/api/Loaithietbi').subscribe({
      next: (data: any) => {
        this.dsLoai = data;
      },
    });
  }

  loadTonghopMayxucDetail() {
    this.dataService.getById('/api/Tonghopmayxuc/' + this.Id).subscribe({
      next: (data: TonghopMayxucDetail) => {
        this.tonghopmayxucDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.tonghopmayxucDetail.ngayLap = myDateString;
      },
    });
  }

  addNewTonghopMayxucDetail() {
    this.dataService.getById('/api/Tonghopmayxuc/' + 0).subscribe({
      next: (data) => {
        this.tonghopmayxucDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.tonghopmayxucDetail.ngayLap = myDateString;
        this.loadFormData(this.tonghopmayxucDetail);
      },
    });
  }

  private loadFormData(mayxuc: TonghopMayxucDetail) {
    this.tonghopmayxucDetail = mayxuc;
    this.Form.setValue({
      id: mayxuc.id,
      maQuanLy: mayxuc.maQuanLy,
      mayXucId: mayxuc.mayXucId,
      phongBanId: mayxuc.phongBanId,
      loaiThietBiId: mayxuc.loaiThietBiId,
      viTriLapDat: mayxuc.viTriLapDat,
      ngayLap: mayxuc.ngayLap,
      soLuong: mayxuc.soLuong,
      tinhTrang: mayxuc.tinhTrang,
      ghiChu: mayxuc.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }

  getDataMayxuc() {
    this.dataService.get('/api/Mayxuc').subscribe({
      next: (data: any) => {
        this.dsMayxuc = data;
      },
    });
  }

  loadTonghopMayxuc() {
    this.dataService
      .get(
        '/api/Tonghopmayxuc/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataMayxucDetail = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopMayxuc();
  }

  onThemmoi() {
    this.title = 'Thêm máy xúc';
    this.themoi = true;
    this.Id = 0;
    this.addNewTonghopMayxucDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopMayxucDetail();
    this.title = 'Sửa máy xúc';
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
  onDelete(id: number) {
    this.Id = id;
    console.log('Id:', this.Id);
    this.dataService.delete('/api/Tonghopmayxuc/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopMayxuc();
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
      this.dataService.post('/api/Tonghopmayxuc', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopMayxuc();
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
        .put('/api/Tonghopmayxuc/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopMayxuc();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataMayxucDetail);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopmayxuc.xlsx');
  }
}
