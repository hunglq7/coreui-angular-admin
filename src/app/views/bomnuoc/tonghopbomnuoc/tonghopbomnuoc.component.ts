import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NhatkybomnuocTabComponent } from '../../bomnuoc/nhatkybomnuoc-tab/nhatkybomnuoc-tab.component';
import { ThongsobomnuocTabComponent } from '../../bomnuoc/thongsobomnuoc-tab/thongsobomnuoc-tab.component';
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
  TabDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  GutterDirective,
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
  TongHopBomNuoc,
  TongHopBomNuocDetail,
} from '../../../core/interface/bomnuoc/bomnuoc-interface';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
@Component({
  selector: 'app-tonghopbomnuoc',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormFeedbackComponent,
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
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    GutterDirective,
    FormsModule,
    NhatkybomnuocTabComponent,
    ThongsobomnuocTabComponent,
    SelectSearchComponent,
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
  templateUrl: './tonghopbomnuoc.component.html',
  styleUrl: './tonghopbomnuoc.component.scss',
})
export class TonghopbomnuocComponent implements OnInit {
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
  data: TongHopBomNuoc[] = [];
  dataDetail: TongHopBomNuocDetail = {
    id: 0,
    maQuanLy: '',
    bomNuocId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 1,
    tinhTrangThietBi: '',
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
    private dialog: MatDialog,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopBomnuoc();
    this.getDataDonvi();
    this.getDataBomnuoc();
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
      bomNuocId: [''],
      donViId: [''],
      viTriLapDat: ['', Validators.required],
      ngayLap: new Date(),
      soLuong: 1,
      tinhTrangThietBi: [''],
      ghiChu: [''],
    });
  }

  eventThietbi($event: any) {
    this.keywordThietbi = $event;
    this.loadTonghopBomnuoc();
  }

  eventDonvi($event: any) {
    this.keywordDonvi = $event;
    this.loadTonghopBomnuoc();
  }
  pageIndexChanged($event: any) {
    this.pageIndex = $event;
    this.loadTonghopBomnuoc();
  }
  pageSizeChange($event: any) {
    this.pageSize = $event;
    this.loadTonghopBomnuoc();
  }
  loadDataDetail() {
    this.dataService.getById('/api/Tonghopbomnuoc/' + this.Id).subscribe({
      next: (data: TongHopBomNuocDetail) => {
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

  addNew() {
    this.dataService.getById('/api/Tonghopbomnuoc/' + 0).subscribe({
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
        this.loadFormData(this.dataDetail);
      },
    });
  }

  private loadFormData(entity: TongHopBomNuocDetail) {
    this.dataDetail = entity;
    this.Form.setValue({
      id: entity.id,
      maQuanLy: entity.maQuanLy,
      bomNuocId: entity.bomNuocId,
      donViId: entity.donViId,
      viTriLapDat: entity.viTriLapDat,
      ngayLap: entity.ngayLap,
      soLuong: entity.soLuong,
      tinhTrang: entity.tinhTrangThietBi,
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

  getDataBomnuoc() {
    this.dataService.get('/api/Danhmucbomnuoc').subscribe({
      next: (data: any) => {
        this.danhSach = data;
      },
    });
  }

  loadTonghopBomnuoc() {
    this.dataService
      .get(
        '/api/Tonghopbomnuoc/paging?thietbiId=' +
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
    this.loadTonghopBomnuoc();
  }
  onThemmoi() {
    this.title = 'Thêm quạt gió';
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
    this.title = 'Sửa bảng quạt gió';
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
    this.dataService.delete('/api/Tonghopbomnuoc/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopBomnuoc();
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
      this.dataService.post('/api/Tonghopbomnuoc', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopBomnuoc();
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
        .put('/api/Tonghopbomnuoc/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopBomnuoc();
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
    XLSX.writeFile(wb, 'Tonghopbomnuoc.xlsx');
  }
}
