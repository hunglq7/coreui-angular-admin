import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhatkyaptomatkhoidongtuTabComponent } from '../nhatkyaptomatkhoidongtu-tab/nhatkyaptomatkhoidongtu-tab.component';
import { ThongsoaptomatkhoidongtuTabComponent } from '../thongsoaptomatkhoidongtu-tab/thongsoaptomatkhoidongtu-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ColComponent,
  DropdownModule,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  SharedModule,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  ThemeDirective,
} from '@coreui/angular';
import {
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
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
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';

export interface TongHopAptomatKhoiDongTu {
  id: number;
  maQuanLy: string;
  tenThietBi: string;
  tenDonVi: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
}

export interface TongHopAptomatKhoiDongTuDetail {
  id: number;
  maQuanLy: string;
  aptomatKhoiDongTuId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  duPhong: boolean;
  ghiChu: string;
}

@Component({
  selector: 'app-tonghopaptomatkhoidongtu',
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
    NhatkyaptomatkhoidongtuTabComponent,
    ThongsoaptomatkhoidongtuTabComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
  templateUrl: './tonghopaptomatkhoidongtu.component.html',
  styleUrl: './tonghopaptomatkhoidongtu.component.scss',
})
export class TonghopaptomatkhoidongtuComponent implements OnInit {
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
  keywordDuPhong: boolean = false;
  data: TongHopAptomatKhoiDongTu[] = [];
  dataDetail: TongHopAptomatKhoiDongTuDetail = {
    id: 0,
    maQuanLy: '',
    aptomatKhoiDongTuId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 1,
    tinhTrangThietBi: '',
    duPhong: this.keywordDuPhong,
    ghiChu: '',
  };
  danhSach: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  public themoi: boolean = false;
  size: NzButtonSize = 'small';

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopAptomatkhoidongtu();
    this.getDataDonvi();
    this.getDataAptomatkhoidongtu();
    if ((this.Id = 0)) {
      this.addNew();
    } else {
      this.loadDataDetail();
    }
  }

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [''],
      maQuanLy: [''],
      aptomatKhoiDongTuId: [''],
      donViId: [''],
      viTriLapDat: ['', Validators.required],
      ngayLap: new Date(),
      soLuong: 1,
      tinhTrangThietBi: [''],
      duPhong: [''],
      ghiChu: [''],
    });
  }

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadTonghopAptomatkhoidongtu();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadTonghopAptomatkhoidongtu();
  }

  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadTonghopAptomatkhoidongtu();
  }

  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadTonghopAptomatkhoidongtu();
  }

  loadDataDetail() {
    this.dataService
      .getById('/api/Tonghopaptomatkhoidongtu/' + this.Id)
      .subscribe({
        next: (data: TongHopAptomatKhoiDongTuDetail) => {
          this.dataDetail = data;
          var myDate = new Date(data.ngayLap);
          var myDateString;
          myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);
          this.dataDetail.ngayLap = myDateString;
        },
      });
  }

  clickSwitch() {
    this.keywordDuPhong = !this.keywordDuPhong;
  }

  addNew() {
    this.dataService.getById('/api/Tonghopaptomatkhoidongtu/' + 0).subscribe({
      next: (data) => {
        this.dataDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.dataDetail.ngayLap = myDateString;
        this.dataDetail.duPhong = this.keywordDuPhong;
        this.loadFormData(this.dataDetail);
      },
    });
  }

  private loadFormData(entity: TongHopAptomatKhoiDongTuDetail) {
    this.dataDetail = entity;
    this.Form.setValue({
      id: entity.id,
      maQuanLy: entity.maQuanLy,
      aptomatKhoiDongTuId: entity.aptomatKhoiDongTuId,
      donViId: entity.donViId,
      viTriLapDat: entity.viTriLapDat,
      ngayLap: entity.ngayLap,
      soLuong: entity.soLuong,
      tinhTrang: entity.tinhTrangThietBi,
      duPhong: entity.duPhong,
      ghiChu: entity.ghiChu,
    });
  }

  getDataDonvi() {
    this.dataService.get('/api/Phongban').subscribe({
      next: (data: any) => {
        this.dsDonvi = data;
      },
    });
  }

  getDataAptomatkhoidongtu() {
    this.dataService.get('/api/Danhmucaptomatkhoidongtu').subscribe({
      next: (data: any) => {
        this.danhSach = data;
      },
    });
  }

  loadTonghopAptomatkhoidongtu() {
    this.dataService
      .get(
        '/api/Tonghopaptomatkhoidongtu/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.data = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
      });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghopAptomatkhoidongtu();
  }

  onThemmoi() {
    this.title = 'Thêm aptomat khởi động từ';
    this.themoi = true;
    this.Id = 0;
    this.addNew();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadDataDetail();
    this.title = 'Sửa aptomat khởi động từ';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  showConfirm(item: any): void {
    let pos = 2;
    this.modal.confirm({
      nzTitle: '<i>Bạn có muốn xóa bản ghi này?</i>',
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
    this.dataService
      .delete('/api/Tonghopaptomatkhoidongtu/' + this.Id)
      .subscribe({
        next: () => {
          this.loadTonghopAptomatkhoidongtu();
          this.toastr.success('Xóa dữ liệu thành công', 'Success');
        },
        error: () => {
          this.toastr.error('Xóa dữ liệu thất bại', 'Error');
        },
      });
  }

  handleLiveDemoChange(event: any) {
    this.liveDemoVisible = event;
  }

  save() {
    if (this.themoi) {
      alert(JSON.stringify(this.Form.value));
      this.dataService
        .post('/api/Tonghopaptomatkhoidongtu', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopAptomatkhoidongtu();
            this.toastr.success('Lưu dữ liệu thành công', 'Success');
            this.liveDemoVisible = !this.liveDemoVisible;
            this.Form.reset();
          },
          error: () => {
            this.toastr.error('Lưu dữ liệu thất bại', 'Error');
          },
        });
    } else {
      alert(JSON.stringify(this.Form.value));
      this.dataService
        .put('/api/Tonghopaptomatkhoidongtu/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopAptomatkhoidongtu();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopaptomatkhoidongtu.xlsx');
  }
}

