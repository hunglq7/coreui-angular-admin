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
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SelectSearchComponent } from '../../../components/nav-select-search/select-search.component';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import {
  Tonghopgiacotthuyluc,
  Tonghopgiacotthuylucdetail,
} from '../../../core/interface/giacotthuyluc/tonghopgiacotthuyluc.interface';

@Component({
  selector: 'app-tonghopgiacotthuyluc',
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
    NzFormModule,
  ],
  templateUrl: './tonghopgiacotthuyluc.component.html',
  styleUrl: './tonghopgiacotthuyluc.component.scss',
})
export class TonghopgiacotthuylucComponent implements OnInit {
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
  Giacots: Tonghopgiacotthuyluc[] = [];
  giacotDetail: Tonghopgiacotthuylucdetail = {
    id: 0,
    thietBiId: 0,
    donViId: 0,
    soLuong: 1,
    ngayLap: '',
    viTriLapDat: '',
    ghiChu: '',
  };
  dsGiacot: any[] = [];
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
      thietBiId: new FormControl(null, Validators.required),
      donViId: new FormControl(null, Validators.required),
      soLuong: new FormControl(0, [Validators.required, Validators.min(1)]),
      ngayLap: new FormControl(null, Validators.required),
      viTriLapDat: new FormControl(''),
      ghiChu: new FormControl(''),
    });
  }

  eventThietbi($event: number) {
    this.keywordThietbi = $event;
    this.loadTonghopgiacot();
  }

  eventDonvi($event: number) {
    this.keywordDonvi = $event;
    this.loadTonghopgiacot();
  }
  loadTonghopgiacotDetail() {
    this.dataService.getById('/api/Tonghopgiacotthuyluc/' + this.Id).subscribe({
      next: (data: Tonghopgiacotthuylucdetail) => {
        this.giacotDetail = data;
        var myDate = new Date(data.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.giacotDetail.ngayLap = myDateString;
      },
    });
  }

  themoiTonghopgiacotDetail() {
    this.dataService.getById('/api/Tonghopgiacotthuyluc/' + 0).subscribe({
      next: (data) => {
        this.giacotDetail = data;
        var myDate = new Date(this.giacotDetail.ngayLap);
        var myDateString;
        myDateString =
          myDate.getFullYear() +
          '-' +
          ('0' + (myDate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + myDate.getDate()).slice(-2);
        this.giacotDetail.ngayLap = myDateString;
        this.loadFormData(this.giacotDetail);
      },
    });
  }

  loadFormData(data: Tonghopgiacotthuylucdetail): void {
    this.Form.patchValue({
      id: data.id,
      thietBiId: data.thietBiId,
      donViId: data.donViId,
      soLuong: data.soLuong,
      ngayLap: data.ngayLap,
      viTriLapDat: data.viTriLapDat,
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

  getDataGiacot() {
    this.dataService.get('/api/Danhmucgiacotthuyluc').subscribe({
      next: (data: any) => {
        this.dsGiacot = data;
      },
    });
  }

  loadTonghopgiacot() {
    this.dataService
      .get(
        '/api/Tonghopgiacotthuyluc/paging?thietbiId=' +
          this.keywordThietbi +
          '&donviId=' +
          this.keywordDonvi +
          '&PageIndex=' +
          this.pageIndex +
          '&PageSize=' +
          this.pageSize
      )
      .subscribe((data: any) => {
        this.Giacots = data.items;
        this.pageSize = data.pageSize;
        this.pageIndex = data.pageIndex;
        this.totalRow = data.totalRecords;
        this.sumSoluong = data.sumRecords;
      });
  }
  public pageIndexChanged(event: any): void {
    this.pageIndex = event;
    this.loadTonghopgiacot();
  }

  onThemmoi() {
    this.title = 'Thêm mới giá cột thủy lực';
    this.themoi = true;
    this.Id = 0;
    this.themoiTonghopgiacotDetail();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.Form.reset();
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit(id: number) {
    this.themoi = false;
    this.Id = id;
    this.loadTonghopgiacotDetail();
    this.title = 'Sửa giá cột thủy lực';
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
  onDelete(item: any) {
    this.Id = item.id;
    this.dataService.delete('/api/Tonghopgiacotthuyluc/' + this.Id).subscribe({
      next: () => {
        this.loadTonghopgiacot();
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
      this.dataService
        .post('/api/Tonghopgiacotthuyluc', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopgiacot();
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
        .put('/api/Tonghopgiacotthuyluc/update', this.Form.value)
        .subscribe({
          next: () => {
            this.loadTonghopgiacot();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Giacots);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Tonghopgiacot.xlsx');
  }
  pageSizeChange(event: number): void {
    this.pageSize = event;
    this.loadTonghopgiacot();
  }

  ngOnInit(): void {
    this.initFormBuilder();
    this.loadTonghopgiacot();
    this.getDataDonvi();
    this.getDataGiacot();
    if ((this.Id = 0)) {
      this.themoiTonghopgiacotDetail();
    } else {
      this.loadTonghopgiacotDetail();
    }
  }
}
