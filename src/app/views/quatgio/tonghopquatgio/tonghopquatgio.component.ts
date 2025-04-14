import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/utils/dialogs/confirm-dialog/confirm-dialog.component';
import { NhatkyquatgioTabComponent } from '../nhatkyquatgio-tab/nhatkyquatgio-tab.component';
import { ThongsoquatgioTabComponent } from '../thongsoquatgio-tab/thongsoquatgio-tab.component';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
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
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

export interface Tonghopquatgio {
  id: number;
  maQuanLy: string;
  tenThietBi: number;
  tenDonVi: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  ghiChu: string;
}

export interface TonghopquatgioDetail {
  id: number;
  maQuanLy: string;
  quatGioId: number;
  donViId: number;
  viTriLapDat: string;
  ngayLap: string;
  soLuong: number;
  tinhTrangThietBi: string;
  ghiChu: string;
}
@Component({
  selector: 'app-tonghopquatgio',
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
    NhatkyquatgioTabComponent,
    ThongsoquatgioTabComponent,
  ],
  templateUrl: './tonghopquatgio.component.html',
  styleUrl: './tonghopquatgio.component.scss',
})
export class TonghopquatgioComponent implements OnInit {
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
  dataQuatgioDetail: Tonghopquatgio[] = [];
  tonghopquatgioDetail: TonghopquatgioDetail = {
    id: 0,
    maQuanLy: '',
    quatGioId: 0,
    donViId: 0,
    viTriLapDat: '',
    ngayLap: '',
    soLuong: 0,
    tinhTrangThietBi: '',
    ghiChu: '',
  };
  dsQuatgio: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  public themoi: boolean = false;

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopQuatgio();
    this.getDataDonvi();
    this.getDataQuatgio();
    if ((this.Id = 0)) {
      this.addNew();
    } else {
      this.loadTonghopQuatgioDetail();
    }
  }
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  private initFormBuilder() {
    this.Form = this.fb.group({
      id: [''],
      maQuanLy: [''],
      quatGioId: [''],
      donViId: [''],
      viTriLapDat: ['', Validators.required],
      ngayLap: new Date(),
      soLuong: 1,
      tinhTrangThietBi: [''],
      ghiChu: [],
    });
  }

  loadTonghopQuatgioDetail() {
    this.dataService.getById('/api/Tonghopquatgio/' + this.Id).subscribe({
      next: (data: TonghopquatgioDetail) => {
        this.tonghopquatgioDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.tonghopquatgioDetail.ngayLap = myDateString;
      },
    });
  }

  addNew() {
    this.dataService.getById('/api/Tonghopquatgio/' + 0).subscribe({
      next: (data) => {
        this.tonghopquatgioDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.tonghopquatgioDetail.ngayLap = myDateString;
        this.loadFormData(this.tonghopquatgioDetail);
      },
    });
  }
  private loadFormData(entity: TonghopquatgioDetail) {
    this.tonghopquatgioDetail = entity;
    this.Form.setValue({
      id: entity.id,
      maQuanLy: entity.maQuanLy,
      quatGioId: entity.quatGioId,
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

  getDataQuatgio() {
    this.dataService.get('/api/Danhmucquatgio').subscribe({
      next: (data: any) => {
        this.dsQuatgio = data;
      },
    });
  }

  loadTonghopQuatgio() {
    this.dataService
      .get(
        '/api/Tonghopquatgio/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.dataQuatgioDetail = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }

  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadTonghopQuatgio();
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
    this.loadTonghopQuatgioDetail();
    this.title = 'Sửa bảng quạt gió';
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
        this.dataService.delete('/api/Tonghopquatgio/' + this.Id).subscribe({
          next: () => {
            this.loadTonghopQuatgio();
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
      this.dataService.post('/api/Tonghopquatgio', this.Form.value).subscribe({
        next: () => {
          this.loadTonghopQuatgio();
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
        .put('/api/Tonghopquatgio/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopQuatgio();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataQuatgioDetail);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopquatgio.xlsx');
  }
  duan1() {
    console.log('Du an 1');
  }
}
