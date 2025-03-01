import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { NhatkymayxucTabComponent } from '../nhatkymayxuc-tab/nhatkymayxuc-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
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
import { IconDirective } from '@coreui/icons-angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
export interface TongHopMayXuc {
  id: number;
  maQuanLy: string;
  tenMayXuc: string;
  loaiThietBi: string;
  tenPhongBan: string;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrang: string;
  ghiChu: string;
}

export interface TonghopMayxucDetail {
  id: number;
  mayXucId: number;
  maQuanLy: string;
  loaiThietBiId: number;
  phongBanId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrang: string;
  ghiChu: string;
}

@Component({
  selector: 'app-tonghopmayxuc',
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
    ButtonDirective,
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
    CardBodyComponent,
    CardComponent,
    RowComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    IconDirective,
    NhatkymayxucTabComponent,
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
  pageIndex = 1;
  pageSize = 10;
  pageDisplay = 10;
  filterKeyword = '';
  dataMayxucDetail: TongHopMayXuc[] = [];
  tonghopmayxucDetail!: TonghopMayxucDetail;
  dsMayxuc: any[] = [];
  dsDonvi: any[] = [];
  dsLoai: any[] = [];
  Tieude: string = 'CHuyền từ component tra';
  Form!: FormGroup;
  Id!: Number;
  public themoi: boolean = false;
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
    private dialog: MatDialog
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
        alert(JSON.stringify(this.tonghopmayxucDetail));
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
        this.loadFormData(data);
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
        '/api/Tonghopmayxuc/paging?Keyword=' +
          this.filterKeyword +
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
      });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghopMayxuc();
  }

  onThemmoi() {
    this.title = 'Thêm mới tời điện';
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
    this.title = 'Sửa tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
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
}
