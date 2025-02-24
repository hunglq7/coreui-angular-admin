import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
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
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormFeedbackComponent,
  InputGroupComponent,
  FormSelectDirective,
  DropdownModule,
  SharedModule,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { DataService } from '../../../core/services/data.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';

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
    ModalFooterComponent,
    ButtonDirective,
    NgTemplateOutlet,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    IconDirective,
    PaginationModule,
    DropdownModule,
    SharedModule,
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
  toitrucs: Tonghoptoitruc[] = [];
  toitrucDetail: TonghoptoitrucDetail[] = [];
  dsToitruc: any[] = [];
  dsDonvi: any[] = [];
  Form!: FormGroup;
  Id!: Number;
  themoi: boolean = false;

  constructor(private dataService: DataService) {
    this.initFormBuilder();
  }
  ngOnInit(): void {
    this.loadTonghoptoitruc();
    this.getDataDonvi();
    this.getDataToitruc();
    if (this.Id) {
      this.loadTonghoptoitrucDetail();
    } else {
      this.themoiTonghoptoitrucDetail();
    }
  }

  initFormBuilder() {
    this.Form = new FormGroup({
      id: new FormControl(0),
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
      next: (data) => {
        this.loadFormData(data);
      },
      error: (err) => {
        alert(err);
      },
    });
  }

  themoiTonghoptoitrucDetail() {
    this.dataService.getById('/api/Toitruc/' + 0).subscribe({
      next: (data) => {
        this.loadFormData(data);
      },
      error: (err) => {
        alert(err);
      },
    });
  }
  loadFormData(items: TonghoptoitrucDetail) {
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
      error: (eror) => {
        alert(eror);
      },
    });
  }

  getDataToitruc() {
    this.dataService.get('/api/Toitruc/getAll').subscribe({
      next: (data: any) => {
        this.dsToitruc = data;
      },
      error: (eror) => {
        alert(eror);
      },
    });
  }

  loadTonghoptoitruc() {
    this.dataService
      .get(
        '/api/Tonghoptoitruc/paging?Keyword=' +
          this.filterKeyword +
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
    this.title = 'Thêm mới tời điện';
    this.themoi = false;
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onClode() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  onEdit() {
    this.title = 'Sửa tời điện';
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }
  onSubmit1() {
    this.customStylesValidated = true;
    alert('Thêm thành công');
  }

  onReset1() {
    this.customStylesValidated = false;
  }

  readonly activeItem = signal(0);
  handleActiveItemChange(value: string | number | undefined) {
    this.activeItem.set(<number>value);
  }
}
